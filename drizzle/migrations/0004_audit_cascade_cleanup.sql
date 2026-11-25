CREATE OR REPLACE FUNCTION public.audit_community_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF TG_OP='DELETE' THEN
  IF EXISTS(SELECT 1 FROM public.workspaces WHERE id=OLD.workspace_id) THEN INSERT INTO public.audit_logs(workspace_id,actor_id,action,entity_type,entity_id,entity_name) VALUES(OLD.workspace_id,auth.uid(),'deleted','community',OLD.id,OLD.name); END IF;
  RETURN OLD;
 ELSE INSERT INTO public.audit_logs(workspace_id,actor_id,action,entity_type,entity_id,entity_name) VALUES(NEW.workspace_id,auth.uid(),lower(TG_OP),'community',NEW.id,NEW.name);RETURN NEW;END IF;END $$;
REVOKE EXECUTE ON FUNCTION public.audit_community_change() FROM PUBLIC,anon,authenticated;