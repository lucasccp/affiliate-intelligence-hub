CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '' CHECK (char_length(display_name)<=100),
 avatar_url text NOT NULL DEFAULT '', language text NOT NULL DEFAULT 'pt-BR', timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
 theme text NOT NULL DEFAULT 'light' CHECK(theme IN ('light','dark','system')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profile_read ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
CREATE POLICY profile_update ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE TABLE public.workspaces (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), personal_owner_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100), language text NOT NULL DEFAULT 'pt-BR', timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
 daily_offer_limit integer NOT NULL DEFAULT 100 CHECK(daily_offer_limit BETWEEN 0 AND 10000),
 zero_cost_budget numeric(10,2) NOT NULL DEFAULT 0 CHECK(zero_cost_budget=0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,UPDATE ON public.workspaces TO authenticated; GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.workspace_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 role text NOT NULL CHECK(role IN ('owner','admin','viewer')),
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,user_id)
);
GRANT SELECT ON public.workspace_members TO authenticated; GRANT ALL ON public.workspace_members TO service_role;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX workspace_members_user_idx ON public.workspace_members(user_id);
CREATE FUNCTION public.is_workspace_member(_workspace uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.workspace_members WHERE workspace_id=_workspace AND user_id=auth.uid()) $$;
CREATE FUNCTION public.can_manage_workspace(_workspace uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.workspace_members WHERE workspace_id=_workspace AND user_id=auth.uid() AND role IN ('owner','admin')) $$;
REVOKE ALL ON FUNCTION public.is_workspace_member(uuid),public.can_manage_workspace(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid),public.can_manage_workspace(uuid) TO authenticated,service_role;
CREATE POLICY member_read ON public.workspace_members FOR SELECT TO authenticated USING(public.is_workspace_member(workspace_id));
CREATE POLICY workspace_read ON public.workspaces FOR SELECT TO authenticated USING(public.is_workspace_member(id));
CREATE POLICY workspace_update ON public.workspaces FOR UPDATE TO authenticated USING(public.can_manage_workspace(id)) WITH CHECK(public.can_manage_workspace(id) AND personal_owner_id=(SELECT w.personal_owner_id FROM public.workspaces w WHERE w.id=id));
CREATE TABLE public.communities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 120),slug text NOT NULL CHECK(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 niche text NOT NULL CHECK(char_length(niche) BETWEEN 1 AND 200),description text NOT NULL DEFAULT '' CHECK(char_length(description)<=2000),
 target_audience text NOT NULL DEFAULT '' CHECK(char_length(target_audience)<=1000),language text NOT NULL DEFAULT 'pt-BR',currency text NOT NULL DEFAULT 'BRL' CHECK(currency ~ '^[A-Z]{3}$'),timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
 daily_offer_limit integer NOT NULL DEFAULT 20 CHECK(daily_offer_limit BETWEEN 0 AND 10000),
 automation_mode text NOT NULL DEFAULT 'assisted' CHECK(automation_mode IN ('manual','assisted','automatic')),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','configuring','ready','active','paused','archived')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(workspace_id,slug),UNIQUE(id,workspace_id)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.communities TO authenticated;GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE INDEX communities_workspace_status_idx ON public.communities(workspace_id,status);
CREATE TABLE public.community_categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL,workspace_id uuid NOT NULL,
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE,UNIQUE(community_id,name)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.community_categories TO authenticated;GRANT ALL ON public.community_categories TO service_role;
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
CREATE INDEX categories_workspace_idx ON public.community_categories(workspace_id);
CREATE TABLE public.community_settings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL UNIQUE,workspace_id uuid NOT NULL,
 unique_offers_only boolean NOT NULL DEFAULT true,approval_required boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.community_settings TO authenticated;GRANT ALL ON public.community_settings TO service_role;
ALTER TABLE public.community_settings ENABLE ROW LEVEL SECURITY;
CREATE INDEX community_settings_workspace_idx ON public.community_settings(workspace_id);
CREATE TABLE public.marketplace_connections (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL,workspace_id uuid NOT NULL,
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100),status text NOT NULL DEFAULT 'unconfigured' CHECK(status IN ('unconfigured','disabled')),
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE,UNIQUE(community_id,name)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.marketplace_connections TO authenticated;GRANT ALL ON public.marketplace_connections TO service_role;
ALTER TABLE public.marketplace_connections ENABLE ROW LEVEL SECURITY;
CREATE INDEX marketplace_workspace_idx ON public.marketplace_connections(workspace_id);
CREATE TABLE public.channels (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL,workspace_id uuid NOT NULL,
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100),status text NOT NULL DEFAULT 'unconfigured' CHECK(status IN ('unconfigured','disabled')),
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE,UNIQUE(community_id,name)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.channels TO authenticated;GRANT ALL ON public.channels TO service_role;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE INDEX channels_workspace_idx ON public.channels(workspace_id);
CREATE TABLE public.automation_rules (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL,workspace_id uuid NOT NULL,
 name text NOT NULL DEFAULT '',enabled boolean NOT NULL DEFAULT false CHECK(enabled=false),
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,workspace_id) REFERENCES public.communities(id,workspace_id) ON DELETE CASCADE
);
GRANT SELECT ON public.automation_rules TO authenticated;GRANT ALL ON public.automation_rules TO service_role;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
CREATE INDEX automation_workspace_idx ON public.automation_rules(workspace_id);
CREATE TABLE public.audit_logs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
 actor_id uuid,action text NOT NULL,entity_type text NOT NULL,entity_id uuid,entity_name text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX audit_workspace_time_idx ON public.audit_logs(workspace_id,created_at DESC);
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['communities','community_categories','community_settings','marketplace_connections','channels'] LOOP
 EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING(public.is_workspace_member(workspace_id))',t||'_read',t);
 EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK(public.can_manage_workspace(workspace_id))',t||'_insert',t);
 EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING(public.can_manage_workspace(workspace_id)) WITH CHECK(public.can_manage_workspace(workspace_id))',t||'_update',t);
 EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING(public.can_manage_workspace(workspace_id))',t||'_delete',t);
 END LOOP;
END $$;
CREATE POLICY automation_read ON public.automation_rules FOR SELECT TO authenticated USING(public.is_workspace_member(workspace_id));
CREATE POLICY audit_read ON public.audit_logs FOR SELECT TO authenticated USING(public.is_workspace_member(workspace_id));
CREATE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['profiles','workspaces','communities','community_categories','community_settings','marketplace_connections','channels','automation_rules'] LOOP EXECUTE format('CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()',t); END LOOP; END $$;
CREATE FUNCTION public.protect_workspace_identity() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN IF NEW.personal_owner_id IS DISTINCT FROM OLD.personal_owner_id THEN RAISE EXCEPTION 'Workspace owner is immutable';END IF;RETURN NEW;END $$;
CREATE TRIGGER protect_workspace_identity BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_identity();
CREATE FUNCTION public.audit_community_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF TG_OP='DELETE' THEN INSERT INTO public.audit_logs(workspace_id,actor_id,action,entity_type,entity_id,entity_name) VALUES(OLD.workspace_id,auth.uid(),'deleted','community',OLD.id,OLD.name);RETURN OLD;
 ELSE INSERT INTO public.audit_logs(workspace_id,actor_id,action,entity_type,entity_id,entity_name) VALUES(NEW.workspace_id,auth.uid(),lower(TG_OP),'community',NEW.id,NEW.name);RETURN NEW;END IF;END $$;
CREATE TRIGGER audit_community AFTER INSERT OR UPDATE OR DELETE ON public.communities FOR EACH ROW EXECUTE FUNCTION public.audit_community_change();
CREATE FUNCTION public.bootstrap_personal_workspace(_user uuid,_name text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE w uuid;c uuid;BEGIN
 INSERT INTO public.profiles(id,display_name) VALUES(_user,left(coalesce(_name,''),100)) ON CONFLICT(id) DO NOTHING;
 INSERT INTO public.workspaces(personal_owner_id,name) VALUES(_user,'Meu workspace') ON CONFLICT(personal_owner_id) DO NOTHING;
 SELECT id INTO w FROM public.workspaces WHERE personal_owner_id=_user;
 INSERT INTO public.workspace_members(workspace_id,user_id,role) VALUES(w,_user,'owner') ON CONFLICT(workspace_id,user_id) DO NOTHING;
 INSERT INTO public.communities(workspace_id,name,slug,niche,language,currency,timezone,daily_offer_limit,status,automation_mode) VALUES(w,'Garagem de Ofertas','garagem-de-ofertas','Automotivo','pt-BR','BRL','America/Sao_Paulo',20,'draft','assisted') ON CONFLICT(workspace_id,slug) DO NOTHING;
 SELECT id INTO c FROM public.communities WHERE workspace_id=w AND slug='garagem-de-ofertas';
 INSERT INTO public.community_settings(community_id,workspace_id,unique_offers_only,approval_required) VALUES(c,w,true,true) ON CONFLICT(community_id) DO NOTHING;
 INSERT INTO public.community_categories(community_id,workspace_id,name) VALUES(c,w,'Estética automotiva'),(c,w,'Acessórios internos'),(c,w,'Acessórios externos'),(c,w,'Ferramentas'),(c,w,'Eletrônicos automotivos'),(c,w,'Organização veicular'),(c,w,'Manutenção e cuidados'),(c,w,'Acessórios para motociclistas') ON CONFLICT(community_id,name) DO NOTHING;
 INSERT INTO public.marketplace_connections(community_id,workspace_id,name) VALUES(c,w,'Mercado Livre'),(c,w,'Shopee'),(c,w,'Amazon') ON CONFLICT(community_id,name) DO NOTHING;
 INSERT INTO public.channels(community_id,workspace_id,name) VALUES(c,w,'WhatsApp'),(c,w,'Instagram'),(c,w,'Telegram'),(c,w,'Landing Page') ON CONFLICT(community_id,name) DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.bootstrap_personal_workspace(uuid,text) FROM PUBLIC,authenticated,anon;GRANT EXECUTE ON FUNCTION public.bootstrap_personal_workspace(uuid,text) TO service_role;
CREATE FUNCTION public.on_auth_signup() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN PERFORM public.bootstrap_personal_workspace(NEW.id,NEW.raw_user_meta_data->>'display_name');RETURN NEW;END $$;
REVOKE ALL ON FUNCTION public.on_auth_signup() FROM PUBLIC;
CREATE TRIGGER app_auth_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.on_auth_signup();
DO $$ DECLARE u record;BEGIN FOR u IN SELECT id,raw_user_meta_data FROM auth.users LOOP PERFORM public.bootstrap_personal_workspace(u.id,u.raw_user_meta_data->>'display_name');END LOOP;END $$;
CREATE FUNCTION public.save_community(_workspace uuid,_id uuid,_data jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$ DECLARE c uuid;BEGIN
 IF NOT public.can_manage_workspace(_workspace) THEN RAISE EXCEPTION 'Permission denied';END IF;
 IF _id IS NULL THEN INSERT INTO public.communities(workspace_id,name,slug,niche,description,target_audience,language,currency,timezone,daily_offer_limit,automation_mode,status)
 VALUES(_workspace,_data->>'name',_data->>'slug',_data->>'niche',coalesce(_data->>'description',''),coalesce(_data->>'target_audience',''),_data->>'language',_data->>'currency',_data->>'timezone',(_data->>'daily_offer_limit')::integer,coalesce(_data->>'automation_mode','assisted'),_data->>'status') RETURNING id INTO c;
 ELSE UPDATE public.communities SET name=_data->>'name',slug=_data->>'slug',niche=_data->>'niche',description=coalesce(_data->>'description',''),target_audience=coalesce(_data->>'target_audience',''),language=_data->>'language',currency=_data->>'currency',timezone=_data->>'timezone',daily_offer_limit=(_data->>'daily_offer_limit')::integer,automation_mode=coalesce(_data->>'automation_mode','assisted'),status=_data->>'status' WHERE id=_id AND workspace_id=_workspace RETURNING id INTO c;
 IF c IS NULL THEN RAISE EXCEPTION 'Community not found';END IF;END IF;
 DELETE FROM public.community_categories WHERE community_id=c AND workspace_id=_workspace;
 INSERT INTO public.community_categories(community_id,workspace_id,name) SELECT c,_workspace,value FROM jsonb_array_elements_text(coalesce(_data->'categories','[]'::jsonb)) ON CONFLICT(community_id,name) DO NOTHING;
 DELETE FROM public.marketplace_connections WHERE community_id=c AND workspace_id=_workspace;
 INSERT INTO public.marketplace_connections(community_id,workspace_id,name) SELECT c,_workspace,value FROM jsonb_array_elements_text(coalesce(_data->'marketplaces','[]'::jsonb)) ON CONFLICT(community_id,name) DO NOTHING;
 DELETE FROM public.channels WHERE community_id=c AND workspace_id=_workspace;
 INSERT INTO public.channels(community_id,workspace_id,name) SELECT c,_workspace,value FROM jsonb_array_elements_text(coalesce(_data->'channels','[]'::jsonb)) ON CONFLICT(community_id,name) DO NOTHING;
 INSERT INTO public.community_settings(community_id,workspace_id) VALUES(c,_workspace) ON CONFLICT(community_id) DO NOTHING;
 RETURN c;
END $$;
REVOKE ALL ON FUNCTION public.save_community(uuid,uuid,jsonb) FROM PUBLIC;GRANT EXECUTE ON FUNCTION public.save_community(uuid,uuid,jsonb) TO authenticated;
