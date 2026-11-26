CREATE OR REPLACE FUNCTION public.pilot_export_offer(_offer uuid) RETURNS SETOF public.pilot_offer_revisions LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.pilot_offers; r public.pilot_offer_revisions; t timestamptz; BEGIN
 SELECT * INTO o FROM public.pilot_offers WHERE id=_offer;
 IF o.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(o.workspace_id,o.community_id);
 SELECT * INTO o FROM public.pilot_offers WHERE id=_offer FOR UPDATE;
 SELECT * INTO r FROM public.pilot_offer_revisions WHERE offer_id=_offer AND version=o.current_version;
 t:=clock_timestamp();
 IF o.approved_version IS DISTINCT FROM o.current_version OR r.id IS NULL OR NOT (r.observed_at<=t AND t<r.expires_at) THEN
  RAISE EXCEPTION 'Offer is not exportable' USING ERRCODE='22023'; END IF;
 PERFORM public.pilot_log(o.workspace_id,o.community_id,'exported','offer',_offer,r.version,'{}');
 RETURN NEXT r;
END $$;

CREATE OR REPLACE FUNCTION public.pilot_claim_job(_job uuid,_lease_owner text,_lease_seconds integer DEFAULT 60) RETURNS public.pilot_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE j public.pilot_jobs; t timestamptz; BEGIN
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job;
 IF j.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(j.workspace_id,j.community_id);
 IF _lease_owner IS NULL OR char_length(_lease_owner) NOT BETWEEN 1 AND 100 OR _lease_seconds NOT BETWEEN 5 AND 900 THEN RAISE EXCEPTION 'Invalid lease' USING ERRCODE='22023'; END IF;
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job FOR UPDATE;
 t:=clock_timestamp();
 IF j.status IN ('succeeded','failed') OR (j.status='running' AND j.lease_expires_at>t) THEN RETURN NULL; END IF;
 IF j.attempts>=j.max_attempts THEN
  UPDATE public.pilot_jobs SET status='failed',lease_owner=NULL,lease_expires_at=NULL,last_error='max_attempts',completed_at=t WHERE id=_job;
  PERFORM public.pilot_log(j.workspace_id,j.community_id,'failed','job',_job,j.version,'{"reason":"max_attempts"}'); RETURN NULL; END IF;
 UPDATE public.pilot_jobs SET status='running',attempts=attempts+1,lease_owner=_lease_owner,lease_expires_at=t+make_interval(secs=>_lease_seconds) WHERE id=_job RETURNING * INTO j;
 PERFORM public.pilot_log(j.workspace_id,j.community_id,'claimed','job',_job,j.version,jsonb_build_object('attempt',j.attempts));
 RETURN j;
END $$;

CREATE OR REPLACE FUNCTION public.pilot_complete_job(_job uuid,_lease_owner text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE j public.pilot_jobs; wf public.pilot_workflows; o public.pilot_offers; r public.pilot_offer_revisions; a uuid; t timestamptz; BEGIN
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job;
 IF j.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(j.workspace_id,j.community_id);
 SELECT * INTO wf FROM public.pilot_workflows WHERE id=j.workflow_id;
 SELECT * INTO o FROM public.pilot_offers WHERE id=wf.offer_id FOR UPDATE;
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job FOR UPDATE;
 t:=clock_timestamp();
 IF j.status<>'running' OR j.lease_owner IS DISTINCT FROM _lease_owner OR j.lease_expires_at<=t THEN RAISE EXCEPTION 'Lease is not held' USING ERRCODE='55P03'; END IF;
 SELECT * INTO r FROM public.pilot_offer_revisions WHERE offer_id=wf.offer_id AND version=j.version;
 IF r.id IS NULL OR o.current_version<>j.version OR o.approved_version IS DISTINCT FROM o.current_version OR NOT (r.observed_at<=t AND t<r.expires_at) THEN
  RAISE EXCEPTION 'Offer is not exportable' USING ERRCODE='22023'; END IF;
 INSERT INTO public.pilot_artifacts(offer_id,workspace_id,community_id,version,kind,content,job_id) VALUES(wf.offer_id,j.workspace_id,j.community_id,j.version,'text_export',r.draft_text,_job) ON CONFLICT(offer_id,version,kind) DO NOTHING;
 SELECT id INTO a FROM public.pilot_artifacts WHERE offer_id=wf.offer_id AND version=j.version AND kind='text_export';
 UPDATE public.pilot_jobs SET status='succeeded',lease_owner=NULL,lease_expires_at=NULL,completed_at=t WHERE id=_job;
 PERFORM public.pilot_log(j.workspace_id,j.community_id,'completed','job',_job,j.version,jsonb_build_object('artifact',a));
 RETURN a;
END $$;

CREATE OR REPLACE FUNCTION public.pilot_reserve_quota(_account uuid,_community uuid,_modality text,_operation_key text,_units bigint,_additional_cents bigint) RETURNS public.pilot_quota_reservations LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE acc public.pilot_quota_accounts; res public.pilot_quota_reservations; BEGIN
 IF _additional_cents IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'cost_policy' USING ERRCODE='22023'; END IF;
 IF _units IS NULL OR _units<=0 OR _modality NOT IN ('text','image') OR _operation_key IS NULL THEN RAISE EXCEPTION 'cost_policy' USING ERRCODE='22023'; END IF;
 SELECT * INTO acc FROM public.pilot_quota_accounts WHERE id=_account;
 IF acc.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(acc.workspace_id,_community);
 SELECT * INTO acc FROM public.pilot_quota_accounts WHERE id=_account FOR UPDATE;
 SELECT * INTO res FROM public.pilot_quota_reservations WHERE account_id=_account AND operation_key=_operation_key;
 IF res.id IS NOT NULL THEN
  IF res.community_id=_community AND res.modality=_modality AND res.units=_units THEN RETURN res; END IF;
  RAISE EXCEPTION 'idempotency_conflict' USING ERRCODE='23505';
 END IF;
 IF NOT clock_timestamp()<acc.snapshot_valid_until THEN RAISE EXCEPTION 'unverified_allowance' USING ERRCODE='22023'; END IF;
 IF _units>GREATEST(0,acc.allowance-acc.margin-acc.accounted-acc.reserved) THEN RAISE EXCEPTION 'quota' USING ERRCODE='22023'; END IF;
 INSERT INTO public.pilot_quota_reservations(account_id,workspace_id,community_id,modality,operation_key,units,created_by) VALUES(_account,acc.workspace_id,_community,_modality,_operation_key,_units,auth.uid()) RETURNING * INTO res;
 UPDATE public.pilot_quota_accounts SET reserved=reserved+_units WHERE id=_account;
 PERFORM public.pilot_log(acc.workspace_id,_community,'reserved','quota',res.id,NULL,jsonb_build_object('modality',_modality,'units',_units));
 RETURN res;
END $$;

REVOKE ALL ON FUNCTION public.pilot_export_offer(uuid),public.pilot_claim_job(uuid,text,integer),public.pilot_complete_job(uuid,text),public.pilot_reserve_quota(uuid,uuid,text,text,bigint,bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.pilot_export_offer(uuid),public.pilot_claim_job(uuid,text,integer),public.pilot_complete_job(uuid,text),public.pilot_reserve_quota(uuid,uuid,text,text,bigint,bigint) TO authenticated,service_role;