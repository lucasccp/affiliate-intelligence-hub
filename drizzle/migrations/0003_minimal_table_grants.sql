REVOKE ALL ON public.workspace_members,public.audit_logs,public.automation_rules FROM anon,authenticated;
GRANT SELECT ON public.workspace_members,public.audit_logs,public.automation_rules TO authenticated;
REVOKE ALL ON public.profiles,public.workspaces FROM anon;
REVOKE INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON public.workspaces FROM authenticated;
REVOKE INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON public.profiles FROM authenticated;
REVOKE ALL ON public.communities,public.community_categories,public.community_settings,public.channels,public.marketplace_connections FROM anon;
