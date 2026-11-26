CREATE TABLE public.pilot_offers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 workspace_id uuid NOT NULL, community_id uuid NOT NULL,
 current_version integer NOT NULL DEFAULT 0 CHECK(current_version>=0),
 approved_version integer CHECK(approved_version IS NULL OR (approved_version>0 AND approved_version<=current_version)),
 approved_by uuid, approved_at timestamptz,
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE,
 UNIQUE(id,workspace_id,community_id),
 CHECK((approved_version IS NULL)=(approved_by IS NULL) AND (approved_version IS NULL)=(approved_at IS NULL))
);
CREATE TABLE public.pilot_offer_revisions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 offer_id uuid NOT NULL, workspace_id uuid NOT NULL, community_id uuid NOT NULL,
 version integer NOT NULL CHECK(version>0),
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 120 AND name !~ '[\r\n]'),
 source_url text NOT NULL CHECK(char_length(source_url)<=2048 AND source_url ~ '^https://[^/@\s]+'),
 price_cents bigint NOT NULL CHECK(price_cents>0 AND price_cents<=100000000),
 currency text NOT NULL DEFAULT 'BRL' CHECK(currency ~ '^[A-Z]{3}$'),
 observed_at timestamptz NOT NULL, expires_at timestamptz NOT NULL,
 draft_text text NOT NULL CHECK(char_length(draft_text)<=4000),
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(expires_at>observed_at),
 UNIQUE(offer_id,version),
 FOREIGN KEY(offer_id,workspace_id,community_id) REFERENCES public.pilot_offers(id,workspace_id,community_id) ON DELETE CASCADE
);
CREATE TABLE public.pilot_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 workspace_id uuid NOT NULL, community_id uuid,
 actor_id uuid, action text NOT NULL, entity_type text NOT NULL, entity_id uuid, version integer,
 detail jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE
);
CREATE TABLE public.pilot_workflows (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 workspace_id uuid NOT NULL, community_id uuid NOT NULL, offer_id uuid NOT NULL,
 kind text NOT NULL DEFAULT 'offer_pipeline' CHECK(kind IN ('offer_pipeline')),
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(offer_id,kind), UNIQUE(id,workspace_id,community_id),
 FOREIGN KEY(offer_id,workspace_id,community_id) REFERENCES public.pilot_offers(id,workspace_id,community_id) ON DELETE CASCADE
);
CREATE TABLE public.pilot_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 workflow_id uuid NOT NULL, workspace_id uuid NOT NULL, community_id uuid NOT NULL,
 step text NOT NULL CHECK(step IN ('export_artifact')), version integer NOT NULL CHECK(version>0),
 idempotency_key text NOT NULL UNIQUE,
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','succeeded','failed')),
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0), max_attempts integer NOT NULL DEFAULT 3 CHECK(max_attempts BETWEEN 1 AND 10 AND attempts<=max_attempts),
 lease_owner text, lease_expires_at timestamptz, last_error text,
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 UNIQUE(workflow_id,step,version),
 FOREIGN KEY(workflow_id,workspace_id,community_id) REFERENCES public.pilot_workflows(id,workspace_id,community_id) ON DELETE CASCADE
);
CREATE TABLE public.pilot_artifacts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 offer_id uuid NOT NULL, workspace_id uuid NOT NULL, community_id uuid NOT NULL,
 version integer NOT NULL, kind text NOT NULL CHECK(kind IN ('text_export')),
 content text NOT NULL, job_id uuid REFERENCES public.pilot_jobs(id) ON DELETE SET NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(offer_id,version,kind),
 FOREIGN KEY(offer_id,version) REFERENCES public.pilot_offer_revisions(offer_id,version) ON DELETE CASCADE,
 FOREIGN KEY(offer_id,workspace_id,community_id) REFERENCES public.pilot_offers(id,workspace_id,community_id) ON DELETE CASCADE
);
CREATE TABLE public.pilot_quota_accounts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
 provider text NOT NULL CHECK(provider IN ('simulated')),
 period_start date NOT NULL,
 allowance bigint NOT NULL DEFAULT 0 CHECK(allowance>=0), margin bigint NOT NULL DEFAULT 0 CHECK(margin>=0),
 accounted bigint NOT NULL DEFAULT 0 CHECK(accounted>=0), reserved bigint NOT NULL DEFAULT 0 CHECK(reserved>=0),
 snapshot_valid_until timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(workspace_id,provider,period_start), UNIQUE(id,workspace_id)
);
CREATE TABLE public.pilot_quota_reservations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id uuid NOT NULL, workspace_id uuid NOT NULL, community_id uuid NOT NULL,
 modality text NOT NULL CHECK(modality IN ('text','image')),
 operation_key text NOT NULL CHECK(char_length(operation_key) BETWEEN 1 AND 200),
 units bigint NOT NULL CHECK(units>0), observed_units bigint CHECK(observed_units>=0),
 status text NOT NULL DEFAULT 'reserved' CHECK(status IN ('reserved','consumed','released','uncertain')),
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), settled_at timestamptz,
 UNIQUE(account_id,operation_key),
 FOREIGN KEY(account_id,workspace_id) REFERENCES public.pilot_quota_accounts(id,workspace_id) ON DELETE CASCADE,
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE
);
CREATE INDEX pilot_offers_scope_idx ON public.pilot_offers(workspace_id,community_id);
CREATE INDEX pilot_events_scope_idx ON public.pilot_events(workspace_id,created_at DESC);
CREATE INDEX pilot_jobs_status_idx ON public.pilot_jobs(workspace_id,status);
CREATE INDEX pilot_reservations_scope_idx ON public.pilot_quota_reservations(workspace_id,status);

DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['pilot_offers','pilot_offer_revisions','pilot_events','pilot_workflows','pilot_jobs','pilot_artifacts','pilot_quota_accounts','pilot_quota_reservations'] LOOP
 EXECUTE format('GRANT SELECT ON public.%I TO authenticated',t);
 EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING(public.is_workspace_member(workspace_id))',t||'_read',t);
END LOOP; END $$;

CREATE FUNCTION public.pilot_block_mutation() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE='42501'; END $$;
CREATE TRIGGER pilot_revisions_immutable BEFORE UPDATE ON public.pilot_offer_revisions FOR EACH ROW EXECUTE FUNCTION public.pilot_block_mutation();
CREATE TRIGGER pilot_events_immutable BEFORE UPDATE ON public.pilot_events FOR EACH ROW EXECUTE FUNCTION public.pilot_block_mutation();
CREATE TRIGGER pilot_artifacts_immutable BEFORE UPDATE ON public.pilot_artifacts FOR EACH ROW EXECUTE FUNCTION public.pilot_block_mutation();
CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.pilot_offers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.pilot_jobs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.pilot_quota_accounts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE FUNCTION public.pilot_log(_ws uuid,_comm uuid,_action text,_type text,_entity uuid,_version integer,_detail jsonb) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$
 INSERT INTO public.pilot_events(workspace_id,community_id,actor_id,action,entity_type,entity_id,version,detail) VALUES(_ws,_comm,auth.uid(),_action,_type,_entity,_version,coalesce(_detail,'{}'::jsonb)) $$;

CREATE FUNCTION public.pilot_require_manager(_ws uuid,_comm uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF auth.uid() IS NULL OR NOT public.can_manage_workspace(_ws) THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 IF _comm IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.communities WHERE id=_comm AND workspace_id=_ws) THEN RAISE EXCEPTION 'Community not in workspace' USING ERRCODE='42501'; END IF;
END $$;

CREATE FUNCTION public.pilot_save_offer(_workspace uuid,_community uuid,_offer uuid,_data jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.pilot_offers; v integer; rid uuid; nm text; src text; price bigint; obs timestamptz; exp timestamptz; txt text; BEGIN
 PERFORM public.pilot_require_manager(_workspace,_community);
 nm:=btrim(_data->>'name'); src:=_data->>'sourceUrl'; price:=(_data->>'priceCents')::bigint; obs:=(_data->>'observedAt')::timestamptz; exp:=(_data->>'expiresAt')::timestamptz;
 IF nm IS NULL OR src IS NULL OR price IS NULL OR obs IS NULL OR exp IS NULL THEN RAISE EXCEPTION 'Invalid offer' USING ERRCODE='22023'; END IF;
 txt:=concat_ws(E'\n',nm,'Preço observado: R$ '||replace(to_char(price/100.0,'FM999999990.00'),'.',','),'Observado em: '||to_char(obs AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'Validade informada: '||to_char(exp AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'Fonte: '||src);
 IF _offer IS NULL THEN
  INSERT INTO public.pilot_offers(workspace_id,community_id,created_by) VALUES(_workspace,_community,auth.uid()) RETURNING * INTO o;
  PERFORM public.pilot_log(_workspace,_community,'created','offer',o.id,NULL,'{}');
 ELSE
  SELECT * INTO o FROM public.pilot_offers WHERE id=_offer AND workspace_id=_workspace AND community_id=_community FOR UPDATE;
  IF o.id IS NULL THEN RAISE EXCEPTION 'Offer not found' USING ERRCODE='42501'; END IF;
 END IF;
 v:=o.current_version+1;
 INSERT INTO public.pilot_offer_revisions(offer_id,workspace_id,community_id,version,name,source_url,price_cents,observed_at,expires_at,draft_text,created_by)
  VALUES(o.id,_workspace,_community,v,nm,src,price,obs,exp,txt,auth.uid()) RETURNING id INTO rid;
 UPDATE public.pilot_offers SET current_version=v WHERE id=o.id;
 PERFORM public.pilot_log(_workspace,_community,'revised','offer',o.id,v,'{}');
 RETURN o.id;
END $$;

CREATE FUNCTION public.pilot_approve_offer(_offer uuid,_version integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.pilot_offers; BEGIN
 SELECT * INTO o FROM public.pilot_offers WHERE id=_offer FOR UPDATE;
 IF o.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(o.workspace_id,o.community_id);
 IF _version IS DISTINCT FROM o.current_version THEN RAISE EXCEPTION 'Only the current version can be approved' USING ERRCODE='22023'; END IF;
 UPDATE public.pilot_offers SET approved_version=_version,approved_by=auth.uid(),approved_at=now() WHERE id=_offer;
 PERFORM public.pilot_log(o.workspace_id,o.community_id,'approved','offer',_offer,_version,'{}');
END $$;

CREATE FUNCTION public.pilot_export_offer(_offer uuid) RETURNS SETOF public.pilot_offer_revisions LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.pilot_offers; r public.pilot_offer_revisions; BEGIN
 SELECT * INTO o FROM public.pilot_offers WHERE id=_offer;
 IF o.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(o.workspace_id,o.community_id);
 SELECT * INTO r FROM public.pilot_offer_revisions WHERE offer_id=_offer AND version=o.current_version;
 IF o.approved_version IS DISTINCT FROM o.current_version OR r.id IS NULL OR NOT (r.observed_at<=now() AND now()<r.expires_at) THEN
  RAISE EXCEPTION 'Offer is not exportable' USING ERRCODE='22023'; END IF;
 PERFORM public.pilot_log(o.workspace_id,o.community_id,'exported','offer',_offer,r.version,'{}');
 RETURN NEXT r;
END $$;

CREATE FUNCTION public.pilot_enqueue_job(_offer uuid,_step text,_version integer,_max_attempts integer DEFAULT 3) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.pilot_offers; wf uuid; j uuid; k text; BEGIN
 SELECT * INTO o FROM public.pilot_offers WHERE id=_offer;
 IF o.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(o.workspace_id,o.community_id);
 IF NOT EXISTS(SELECT 1 FROM public.pilot_offer_revisions WHERE offer_id=_offer AND version=_version) THEN RAISE EXCEPTION 'Revision not found' USING ERRCODE='22023'; END IF;
 INSERT INTO public.pilot_workflows(workspace_id,community_id,offer_id,created_by) VALUES(o.workspace_id,o.community_id,_offer,auth.uid()) ON CONFLICT(offer_id,kind) DO NOTHING;
 SELECT id INTO wf FROM public.pilot_workflows WHERE offer_id=_offer AND kind='offer_pipeline';
 k:=wf::text||':'||_step||':'||_version;
 INSERT INTO public.pilot_jobs(workflow_id,workspace_id,community_id,step,version,idempotency_key,max_attempts,created_by)
  VALUES(wf,o.workspace_id,o.community_id,_step,_version,k,_max_attempts,auth.uid()) ON CONFLICT(idempotency_key) DO NOTHING RETURNING id INTO j;
 IF j IS NULL THEN SELECT id INTO j FROM public.pilot_jobs WHERE idempotency_key=k;
 ELSE PERFORM public.pilot_log(o.workspace_id,o.community_id,'enqueued','job',j,_version,jsonb_build_object('step',_step)); END IF;
 RETURN j;
END $$;

CREATE FUNCTION public.pilot_claim_job(_job uuid,_lease_owner text,_lease_seconds integer DEFAULT 60) RETURNS public.pilot_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE j public.pilot_jobs; BEGIN
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job FOR UPDATE;
 IF j.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(j.workspace_id,j.community_id);
 IF _lease_owner IS NULL OR char_length(_lease_owner) NOT BETWEEN 1 AND 100 OR _lease_seconds NOT BETWEEN 5 AND 900 THEN RAISE EXCEPTION 'Invalid lease' USING ERRCODE='22023'; END IF;
 IF j.status IN ('succeeded','failed') OR (j.status='running' AND j.lease_expires_at>now()) THEN RETURN NULL; END IF;
 IF j.attempts>=j.max_attempts THEN
  UPDATE public.pilot_jobs SET status='failed',lease_owner=NULL,lease_expires_at=NULL,last_error='max_attempts',completed_at=now() WHERE id=_job;
  PERFORM public.pilot_log(j.workspace_id,j.community_id,'failed','job',_job,j.version,'{"reason":"max_attempts"}'); RETURN NULL; END IF;
 UPDATE public.pilot_jobs SET status='running',attempts=attempts+1,lease_owner=_lease_owner,lease_expires_at=now()+make_interval(secs=>_lease_seconds) WHERE id=_job RETURNING * INTO j;
 PERFORM public.pilot_log(j.workspace_id,j.community_id,'claimed','job',_job,j.version,jsonb_build_object('attempt',j.attempts));
 RETURN j;
END $$;

CREATE FUNCTION public.pilot_complete_job(_job uuid,_lease_owner text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE j public.pilot_jobs; wf public.pilot_workflows; r public.pilot_offer_revisions; a uuid; BEGIN
 SELECT * INTO j FROM public.pilot_jobs WHERE id=_job FOR UPDATE;
 IF j.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(j.workspace_id,j.community_id);
 IF j.status<>'running' OR j.lease_owner IS DISTINCT FROM _lease_owner OR j.lease_expires_at<=now() THEN RAISE EXCEPTION 'Lease is not held' USING ERRCODE='55P03'; END IF;
 SELECT * INTO wf FROM public.pilot_workflows WHERE id=j.workflow_id;
 SELECT * INTO r FROM public.pilot_offer_revisions WHERE offer_id=wf.offer_id AND version=j.version;
 INSERT INTO public.pilot_artifacts(offer_id,workspace_id,community_id,version,kind,content,job_id) VALUES(wf.offer_id,j.workspace_id,j.community_id,j.version,'text_export',r.draft_text,_job) ON CONFLICT(offer_id,version,kind) DO NOTHING;
 SELECT id INTO a FROM public.pilot_artifacts WHERE offer_id=wf.offer_id AND version=j.version AND kind='text_export';
 UPDATE public.pilot_jobs SET status='succeeded',lease_owner=NULL,lease_expires_at=NULL,completed_at=now() WHERE id=_job;
 PERFORM public.pilot_log(j.workspace_id,j.community_id,'completed','job',_job,j.version,jsonb_build_object('artifact',a));
 RETURN a;
END $$;

CREATE FUNCTION public.pilot_record_quota_snapshot(_workspace uuid,_provider text,_period date,_allowance bigint,_margin bigint,_accounted bigint,_valid_until timestamptz) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE id_ uuid; BEGIN
 INSERT INTO public.pilot_quota_accounts(workspace_id,provider,period_start,allowance,margin,accounted,snapshot_valid_until) VALUES(_workspace,_provider,_period,_allowance,_margin,_accounted,_valid_until)
 ON CONFLICT(workspace_id,provider,period_start) DO UPDATE SET allowance=EXCLUDED.allowance,margin=EXCLUDED.margin,accounted=GREATEST(pilot_quota_accounts.accounted,EXCLUDED.accounted),snapshot_valid_until=EXCLUDED.snapshot_valid_until RETURNING id INTO id_;
 RETURN id_;
END $$;

CREATE FUNCTION public.pilot_reserve_quota(_account uuid,_community uuid,_modality text,_operation_key text,_units bigint,_additional_cents bigint) RETURNS public.pilot_quota_reservations LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE acc public.pilot_quota_accounts; res public.pilot_quota_reservations; BEGIN
 SELECT * INTO acc FROM public.pilot_quota_accounts WHERE id=_account FOR UPDATE;
 IF acc.id IS NULL THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
 PERFORM public.pilot_require_manager(acc.workspace_id,_community);
 SELECT * INTO res FROM public.pilot_quota_reservations WHERE account_id=_account AND operation_key=_operation_key;
 IF res.id IS NOT NULL THEN RETURN res; END IF;
 IF _additional_cents IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'cost_policy' USING ERRCODE='22023'; END IF;
 IF _units IS NULL OR _units<=0 THEN RAISE EXCEPTION 'cost_policy' USING ERRCODE='22023'; END IF;
 IF NOT now()<acc.snapshot_valid_until THEN RAISE EXCEPTION 'unverified_allowance' USING ERRCODE='22023'; END IF;
 IF _units>GREATEST(0,acc.allowance-acc.margin-acc.accounted-acc.reserved) THEN RAISE EXCEPTION 'quota' USING ERRCODE='22023'; END IF;
 INSERT INTO public.pilot_quota_reservations(account_id,workspace_id,community_id,modality,operation_key,units,created_by) VALUES(_account,acc.workspace_id,_community,_modality,_operation_key,_units,auth.uid()) RETURNING * INTO res;
 UPDATE public.pilot_quota_accounts SET reserved=reserved+_units WHERE id=_account;
 PERFORM public.pilot_log(acc.workspace_id,_community,'reserved','quota',res.id,NULL,jsonb_build_object('modality',_modality,'units',_units));
 RETURN res;
END $$;

CREATE FUNCTION public.pilot_settle_reservation(_reservation uuid,_outcome text,_observed_units bigint DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE res public.pilot_quota_reservations; used bigint; BEGIN
 SELECT * INTO res FROM public.pilot_quota_reservations WHERE id=_reservation;
 IF res.id IS NULL THEN RAISE EXCEPTION 'Reservation not found'; END IF;
 PERFORM 1 FROM public.pilot_quota_accounts WHERE id=res.account_id FOR UPDATE;
 SELECT * INTO res FROM public.pilot_quota_reservations WHERE id=_reservation FOR UPDATE;
 IF res.status<>'reserved' THEN RETURN; END IF;
 IF _outcome NOT IN ('consumed','released','uncertain') THEN RAISE EXCEPTION 'Invalid outcome'; END IF;
 used:=CASE _outcome WHEN 'released' THEN 0 WHEN 'uncertain' THEN GREATEST(res.units,coalesce(_observed_units,0)) ELSE coalesce(_observed_units,res.units) END;
 UPDATE public.pilot_quota_accounts SET reserved=reserved-res.units,accounted=accounted+used WHERE id=res.account_id;
 UPDATE public.pilot_quota_reservations SET status=_outcome,observed_units=used,settled_at=now() WHERE id=_reservation;
 INSERT INTO public.pilot_events(workspace_id,community_id,actor_id,action,entity_type,entity_id,detail) VALUES(res.workspace_id,res.community_id,NULL,'settled_'||_outcome,'quota',_reservation,jsonb_build_object('units',used));
END $$;

REVOKE ALL ON FUNCTION public.pilot_block_mutation(),public.pilot_log(uuid,uuid,text,text,uuid,integer,jsonb),public.pilot_require_manager(uuid,uuid),
 public.pilot_save_offer(uuid,uuid,uuid,jsonb),public.pilot_approve_offer(uuid,integer),public.pilot_export_offer(uuid),
 public.pilot_enqueue_job(uuid,text,integer,integer),public.pilot_claim_job(uuid,text,integer),public.pilot_complete_job(uuid,text),
 public.pilot_record_quota_snapshot(uuid,text,date,bigint,bigint,bigint,timestamptz),public.pilot_reserve_quota(uuid,uuid,text,text,bigint,bigint),
 public.pilot_settle_reservation(uuid,text,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.pilot_save_offer(uuid,uuid,uuid,jsonb),public.pilot_approve_offer(uuid,integer),public.pilot_export_offer(uuid),
 public.pilot_enqueue_job(uuid,text,integer,integer),public.pilot_claim_job(uuid,text,integer),public.pilot_complete_job(uuid,text),
 public.pilot_reserve_quota(uuid,uuid,text,text,bigint,bigint) TO authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.pilot_record_quota_snapshot(uuid,text,date,bigint,bigint,bigint,timestamptz),public.pilot_settle_reservation(uuid,text,bigint) TO service_role;