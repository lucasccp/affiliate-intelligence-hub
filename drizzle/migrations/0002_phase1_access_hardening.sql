REVOKE EXECUTE ON FUNCTION public.audit_community_change(), public.on_auth_signup(), public.bootstrap_personal_workspace(uuid,text) FROM PUBLIC,anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.is_workspace_member(uuid),public.can_manage_workspace(uuid),public.save_community(uuid,uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid),public.can_manage_workspace(uuid),public.save_community(uuid,uuid,jsonb) TO authenticated;
CREATE INDEX categories_community_workspace_idx ON public.community_categories(community_id,workspace_id);
CREATE INDEX channels_community_workspace_idx ON public.channels(community_id,workspace_id);
CREATE INDEX settings_community_workspace_idx ON public.community_settings(community_id,workspace_id);
CREATE INDEX marketplaces_community_workspace_idx ON public.marketplace_connections(community_id,workspace_id);
CREATE INDEX automation_community_workspace_idx ON public.automation_rules(community_id,workspace_id);
CREATE FUNCTION public.validate_community_operational_limits() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ DECLARE lim integer;BEGIN
 SELECT daily_offer_limit INTO lim FROM public.workspaces WHERE id=NEW.workspace_id FOR UPDATE;
 IF lim IS NULL OR NEW.daily_offer_limit>lim THEN RAISE EXCEPTION 'Community exceeds workspace daily limit';END IF;
 IF TG_OP='UPDATE' AND NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN RAISE EXCEPTION 'Workspace is immutable';END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=NEW.timezone) THEN RAISE EXCEPTION 'Invalid timezone';END IF;
 IF NEW.language !~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$' THEN RAISE EXCEPTION 'Invalid language';END IF;
 RETURN NEW;END $$;
CREATE TRIGGER community_limit BEFORE INSERT OR UPDATE ON public.communities FOR EACH ROW EXECUTE FUNCTION public.validate_community_operational_limits();
CREATE FUNCTION public.validate_workspace_operational_limits() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.communities WHERE workspace_id=NEW.id AND daily_offer_limit>NEW.daily_offer_limit) THEN RAISE EXCEPTION 'Workspace limit below existing community';END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=NEW.timezone) THEN RAISE EXCEPTION 'Invalid timezone';END IF;
 RETURN NEW;END $$;
CREATE TRIGGER workspace_limit BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.validate_workspace_operational_limits();
REVOKE EXECUTE ON FUNCTION public.validate_community_operational_limits(),public.validate_workspace_operational_limits(),public.protect_workspace_identity(),public.touch_updated_at() FROM PUBLIC,anon,authenticated;
