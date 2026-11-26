# Affiliate Intelligence Hub V4.0 — Manual mestre de continuidade

Referência: 26/11/2026. Este documento consolida os requisitos e prompts planejados, adaptados à arquitetura real encontrada no GitHub. Não é prova de implementação. O estado vivo é [PROJECT_STATUS.md](PROJECT_STATUS.md); regras obrigatórias em [AGENTS.md](../AGENTS.md). Não avance automaticamente. Leia também [PRD](PRD.md), [ARCHITECTURE](ARCHITECTURE.md), [DATABASE](DATABASE.md), [ROADMAP](ROADMAP.md), [SECURITY](SECURITY.md), [INTEGRATIONS](INTEGRATIONS.md), [ZERO_COST_POLICY](ZERO_COST_POLICY.md), [AI_PROVIDERS](AI_PROVIDERS.md), [IMAGE_GENERATION](IMAGE_GENERATION.md), [MARKETPLACE_CAPABILITIES](MARKETPLACE_CAPABILITIES.md) e [README](../README.md).

## Atualização V4.0 — benchmark

Leia [COMPETITIVE_BENCHMARK.md](COMPETITIVE_BENCHMARK.md). O trial do concorrente é fonte de evidência funcional, não autorização técnica. Fase 2 permanece próxima; Fase 2.1 pesquisa marketplace/benchmark antes da Fase 3. Fase 10.1 antecipa extensão antes de Offer Hunter. IDs existentes preservados; ordem explícita no ROADMAP. Novos módulos são planejados, não implementados.

## Como retomar sem o chat
1. Abra o repositório no Codex ou Lovable.
2. Use o prompt de contexto abaixo; confira branch, status e alterações pendentes.
3. Autorize explicitamente apenas a próxima fase. Cole o prompt correspondente junto das regras comuns.
4. Execute checkpoint, revise diff/testes, faça PR/merge sem reescrever histórico e confirme sincronização Lovable.
5. Atualize PROJECT_STATUS.md a cada entrega, incluindo decisões, evidências, pendências e próxima fase. Atualize este guia se o plano mudar, preservando histórico de decisões.

## Produto e premissas
Plataforma SaaS multi-nicho para criar comunidades de ofertas e operar marketing de afiliados com agentes especializados. Entrada: nicho (livre), público e canais. Saída: comunidade, identidade visual, kit de lançamento, landing page, checklists de canais, descoberta de ofertas, links autorizados, conteúdo, aprovação, agenda, publicação e métricas. Mercados iniciais Brasil: Mercado Livre, Shopee e Amazon. Canais: WhatsApp, Telegram, Instagram e landing page; X/Threads/Facebook são expansão futura, não escopo obrigatório. Aquisição orgânica, sem ads pagos. Não prometer automação integral onde a API não permite. Orçamento adicional autorizado R$ 0,00; uso de assinatura Codex existente dentro de limites, sem API paga. Nenhuma credencial neste guia.

## Estado de referência
Fase 0 documentada; Fase 1 implementada com ressalvas conforme status de 25/11/2026. 10 tabelas, 16 testes aprovados registrados, lint 0 erros/8 avisos; build e tipos registrados pelo ambiente, não reexecutados nesta revisão. Login, perfil, workspace, CRUD, seed Garagem, dashboard e isolamento registrados como funcionais. E-mail de confirmação/reset e Google/Lovable roundtrip pendentes. Fase 2 não iniciada segundo status lido. Nenhuma IA, oferta, publicação, scheduler ou integração real de canal/marketplace. Repositório informado público na revisão anterior: administrador deve verificar visibilidade e preferir privado. Não inferir estado futuro deste snapshot.

## Arquitetura atual e alvo
Atual: React 19, TypeScript, TanStack Start (rotas por arquivos), TanStack Query, Tailwind v4, shadcn/ui, Zod, Vitest, Bun, Lovable Cloud Auth/PostgreSQL. Não é Supabase Free externo nem Edge Functions. Layout _authenticated, requireSupabaseAuth em RPC, RLS, FKs compostas, papéis protegidos, triggers, save_community SQL invoker atômico, seed idempotente no cadastro. src/components/hub e src/lib/hub-schema.ts, hub.functions.ts, hub-query.ts. Migrations gerenciadas em drizzle/migrations. Lovable gerencia migrations, arquivos gerados, secrets, conectores e gateway IA; respeitar bloco AGENTS.md. Codex cuida de lógica, testes, documentação e código não gerenciado. Não force push/rebase de histórico publicado.

Alvo (condicional): UI administrativa/landing -> fronteira autenticada TanStack -> Supervisor/máquina de estados -> serviços de domínio + Cost Guardian + registry de capacidades -> contratos/adaptadores elegíveis -> PostgreSQL (estado, filas, reservas, aprovações, auditoria) e storage autorizado. Worker Node local opcional isolado do SSR. Sem Redis/Kubernetes/daemon obrigatório. Supabase externo ou híbrido somente se Fase 2 demonstrar viabilidade e administrador autorizar migração. Não contornar gateway Lovable. Filas duráveis com lease, claim atômico, heartbeat, retry limitado, idempotência, versão de configuração, reconciliação e cancelamento. Não presumir execução após resposta HTTP. Efeitos externos não são exactly-once. Entradas e saídas Zod; autorização no servidor e banco; nunca confiar em IDs do browser. Modelo de dados por fase é conceitual, reutilizar tabelas reais em vez de duplicar.

## Agentes
Supervisor coordena dependências; Niche Intelligence analisa público/categorias/tendências; Community Builder configura rascunho; Brand Designer define identidade; Image Creator gera ativos autorizados; Landing Page Agent prepara página; Channel Setup prepara checklists; Offer Hunter coleta candidatos com fonte; Offer Intelligence valida/rankeia; Affiliate Manager resolve links oficiais; Content Creator prepara conteúdo; Publisher publica autorizado; Growth analisa métricas; Cost Guardian autoriza/reserva/bloqueia consumo. Todos são serviços tipados com contexto workspaceId/communityId/workflowId/stepId/configVersion/idempotencyKey. Resultado success com artefatos, human_required com ação, paused com motivo ou failure com retryable. Estados pending/running/waiting_human/paused_quota/succeeded/failed/cancelled, com estados especializados quando necessários. IA não concede privilégios, não decide pagamentos, não inventa preços; lógica determinística para ranking, filtros, horários, validação, limites e dedupe.

## Política financeira e IA
Lovable Cloud tem risco de consumir créditos existentes após franquia; auto top-up desativado não prova hard cap. Gate financeiro ainda pendente. Nenhum serviço pago, upgrade, compra de créditos ou fallback pago automático. Se não for possível provar custo adicional zero, bloquear operação externa e usar templates/importação manual. Verificar quotas reais e licenças atuais; não tratar catálogo como garantia. Cloudflare Workers AI candidato principal para texto e imagem, condicionado a transporte oficial permitido e franquia confirmada. OpenAI preferencial para texto somente se uso oficial dentro da assinatura for comprovado; API separada não presumida gratuita. Ollama/ComfyUI locais opcionais, custo de energia/hardware não incluído na promessa de ausência de cobrança de serviço. Nano Banana/Gemini API desabilitados inicialmente; Pollinations não presumido gratuito. Manual ChatGPT/Gemini pode fornecer artefatos por importação, sem automação de interface. Ledger global por conta, compartilhado texto/imagem, reservas transacionais, reconciliação de consumo externo, margem 20%, cache e fail-closed. Referência de planejamento (não quota verificada): 10.000 neurons/dia, 40% imagens, 35% texto, 5% testes, 20% reserva; substituir por dados oficiais atuais. IA gera fundos/ilustrações; código compõe foto autorizada e dados reais. Não falsificar produto, preço, desconto, comissão, cupom, urgência ou avaliação. Disclosure afiliado e regras de cada canal/marketplace.

## Piloto Garagem de Ofertas
Nicho Automotivo; slug garagem-de-ofertas; pt-BR, BRL, America/Sao_Paulo; 20 ofertas únicas/dia no máximo (600 em 30 dias, não meta); assisted e draft inicialmente. Categorias estética, acessórios internos, acessórios externos, ferramentas, eletrônicos automotivos, organização veicular, manutenção e cuidados, acessórios motociclistas. ML/Shopee/Amazon; WA/IG/Telegram/landing. Marca sugerida #FF7621 #111318 #F5F5F5, slogan Seu carro merece mais. Seu bolso agradece. Score mínimo 75, dedupe 7 dias por produto, 3 ciclos de descoberta (06h,12h,17h), classificação 06h30, conteúdo 06h45, janelas 07–09 3 ofertas, 09–12 4, 12–14 4, 14–18 4, 18–21 5; resumo 21h30. Telegram e landing automáticos apenas elegíveis; WA/IG assistidos; IG 1–2 posts e 3–5 stories/dia como hipótese editável. Até 3 fundos novos + 1 imagem de campanha/dia, reutilizar fundos premium/detailing/acessórios/ferramentas/eletrônicos/promo; 4 gerações vs 20 por dia, não equivalência de consumo. Testar Radar Tech e nicho livre sem herdar categorias. Cadastros oficiais: https://www.mercadolivre.com.br/afiliados, https://affiliate.shopee.com.br/, https://associados.amazon.com.br/. Aprovação e acesso API não presumidos. Cloudflare https://developers.cloudflare.com/workers-ai/ e /pricing/ e /models/; confirmar URLs e dados atuais.

## Regras comuns — prefixo obrigatório de todos os prompts
Atue como engenheiro sênior do Affiliate Intelligence Hub V4.0. Leia AGENTS.md, PROJECT_STATUS.md, este guia e documentos relevantes. Inspecione código, schema e estado real antes de alterar. Execute somente a fase explicitamente autorizada, incrementalmente, preserve design e arquitetura real; não recrie funcionalidades. Lovable é responsável por alterações gerenciadas (migrations, arquivos gerados, secrets, gateway e conectores); solicite ação no editor quando necessário. Sem force push. Orçamento adicional R$0, sem APIs pagas, bypass de plataforma, scraping proibido, segredos no repo ou mocks apresentados como reais. Respeite isolamento workspace/comunidade, RLS, validação, acessibilidade, idempotência, limites, direitos de conteúdo e auditoria. Não implemente chamadas externas antes de comprovar elegibilidade, custo e autorização. Execute testes/lint/build/typecheck possíveis; não execute testes destrutivos nem use dados reais sem autorização. Documente arquivos alterados, resultados, riscos, decisões e limitações em PROJECT_STATUS.md e documentos pertinentes. Classifique APPROVED / APPROVED_WITH_WARNINGS / BLOCKED. Gate financeiro não pode ser ignorado. Pare e aguarde autorização para próxima fase.

## Roteamento obrigatório de execução

O Codex é o ponto de entrada para diagnóstico, autorização, revisão e acompanhamento. A ferramenta de cada fase está indicada no respectivo título/linha Ferramenta. Nas fases híbridas, a ordem padrão é Codex (inspeção e plano técnico) → Lovable (somente alterações gerenciadas necessárias) → sincronização GitHub → Codex (implementação não gerenciada, testes e checkpoint). Se não houver alteração gerenciada, dispensar Lovable. Se houver dependência técnica diferente, explicar e indicar a ordem exata. Nunca editar migrations/arquivos gerados/secrets gerenciados nem contornar gateway. Não presumir acesso ao Lovable.

Em todo diagnóstico, autorização e checkpoint, informar: fase atual e status; próxima fase e gate; ferramenta de início (Codex ou Lovable); sequência de ferramentas e motivo; ação do usuário; prompt exato pronto para copiar na ferramenta indicada, limitado ao escopo autorizado. Se a próxima etapa exigir Lovable, parar antes da alteração gerenciada e fornecer prompt específico para o editor, com critérios de aceite e instrução de sincronização. Depois da sincronização, fornecer prompt de retomada no Codex. Não executar outra fase sem autorização. Se bloqueado, indicar ferramenta e prompt para resolver o bloqueio, sem habilitar serviços pagos.

Checkpoint e recuperação de contexto: Codex. Revisão técnica após Lovable: Codex. Fases 0 e 1 são históricas (Lovable); não reexecutar sem autorização. Fases 2, 2.1, 6 e 18: Codex. Fases 3–5, 7–10, 10.1, 11–17 e 19–20: híbridas, com Codex como ponto de entrada e Lovable somente quando necessário. Esta regra detalha a ordem das linhas Ferramenta, não altera os requisitos de produto.

## Prompts de implementação (usar com regras comuns e roteamento obrigatório)

### Fase 0 — Governança e arquitetura

Ferramenta: Lovable.

**Prompt:** Documentar PRD, arquitetura, modelo conceitual, segurança, roadmap, integrações, política financeira, provedores e status. Definir agentes como serviços tipados, contratos, estados, gates e isolamento. Não implementar fases futuras.

**Aceite:** AGENTS.md, README e docs/PRD.md, ARCHITECTURE.md, DATABASE.md, ROADMAP.md, SECURITY.md, INTEGRATIONS.md, ZERO_COST_POLICY.md, AI_PROVIDERS.md, IMAGE_GENERATION.md, MARKETPLACE_CAPABILITIES.md, PROJECT_STATUS.md. Decisões e divergências explícitas.


### Fase 1 — Fundação

Ferramenta: Lovable.

**Prompt:** Construir SaaS pt-BR responsivo, claro/escuro, sidebar, header, seletor global, dashboard real, autenticação, recuperação, perfil, workspace e CRUD atômico de comunidades. Módulos futuros indisponíveis, não simulados. Campos nome, slug, nicho livre, público, idioma, moeda, fuso, categorias, canais, marketplaces, limites, modo e status. Estados draft/configuring/ready/active/paused/archived; manual/assisted/automatic. Seed idempotente no lifecycle de cadastro, não na página. Tabelas profiles, workspaces, workspace_members, communities, community_categories, community_settings, marketplace_connections, channels, automation_rules, audit_logs (nomes reais prevalecem).

**Aceite:** Validar login/logout, recuperação real quando autorizada, segundo nicho, persistência, isolamento com duas contas, RLS, FKs compostas, limites e auditoria. Fase histórica: não reconstruir.


### Fase 2 — Integration Discovery e viabilidade

Ferramenta: Codex.

**Prompt:** Revisar Fase 1: bun install --frozen-lockfile, bun run lint/test/build e typecheck quando possível; não executar testes de produção sem autorização. Pesquisar fontes oficiais atuais sobre Lovable Cloud (franquia, backend, banco, storage, funções, IA, créditos, auto top-up, hard cap, comportamento pós-franquia), comparar manter Cloud, Supabase Free externo se suportado, híbrido gratuito. Não migrar. Validar Cloudflare Workers AI: preços, franquia compartilhada, modelos textuais, FLUX.1 Schnell e FLUX.2 Klein, geração/edição, IDs, parâmetros, licenças comerciais, limites, autenticação, retenção, billing e transporte oficialmente permitido no Lovable/TanStack sem violar AGENTS.md. Validar OpenAI Sign in with ChatGPT, Codex CLI/SDK, elegibilidade local/hospedada, automação e custos; assinatura não equivale à API. Validar Mercado Livre, Shopee, Amazon Brasil: cadastro, aprovação, catálogo, busca, mais vendidos, tendências, promoções, cupons, comissões, links, feeds, relatórios, armazenamento, divulgação, limites e custos. Validar WhatsApp grupos oficiais, Instagram Graph, Telegram Bot, permissões, criação de contas, publicação, links e custos. Verificar planos Lovable/Supabase/GitHub/Cloudflare. Matriz por capacidade: supported, requires_approval, requires_credentials, manual_only, unavailable, unverified, paid_blocked; fonte oficial, URL, data, evidência, alternativa. Sem internet, marcar não verificado. Não habilitar APIs nem realizar chamadas de IA, não alterar billing ou migrations.

**Aceite:** Criar docs/PHASE_01_VALIDATION.md, PHASE_02_FEASIBILITY.md, COST_FEASIBILITY.md; atualizar arquitetura, integrações, política, provedores, imagens, marketplaces e status. Parecer APPROVED/APPROVED_WITH_WARNINGS/BLOCKED para Fase 3, com gate financeiro obrigatório.


### Fase 2.1 — Marketplace Integration Research e benchmark

Ferramenta: Codex.

**Prompt:** Leia COMPETITIVE_BENCHMARK.md, relatórios da Fase 2 e evidências sanitizadas fornecidas pelo usuário. Investigue documentação oficial atual Shopee Affiliate API, Mercado Livre afiliados/developers e Amazon Creators API/links oficiais; diferencie busca, rankings, enriquecimento, cupons, comissão e link. Compare fluxos do DivulgaLinks e extensão pública, permissões e comportamento observável sem copiar código nem acessar sessão/endpoint privado. Registre evidência, hipótese, fonte, data, custo, termos, aprovação, retenção, canais e alternativa manual. Proponha contratos DiscoveryProvider, ProductProvider, AffiliateLinkProvider independentes e CouponProvider opcional. POC somente local com fixtures sintéticas e contratos, sem credenciais, scraping proibido ou chamadas externas não autorizadas. Defina extensão Manifest V3 assistida, mínimo privilégio e captura por ação do usuário; não exportar cookies/sessões. Priorize Shopee se elegível, ML importação assistida, Amazon links oficiais. Atualize benchmark, MARKETPLACE_CAPABILITIES, INTEGRATIONS, arquitetura e status; não implementar Fase 3.

**Aceite:** matriz por capacidade e marketplace, fluxos e lacunas verificáveis, plano de POC e parecer financeiro/técnico; ausência de prints ou acesso é pendência explícita, não confirmação fictícia.

### Fase 3 — AI Core e Cost Guardian

Ferramenta: Lovable + Codex.

**Prompt:** Definir TextProvider e ImageProvider: getCapabilities, getConnectionStatus, validateConfiguration, estimateUsage, healthCheck, executeTask ou generateImage/editImage. Registry, schemas versionados, templates e importação manual funcionais; outros bloqueados até autorização. Tipos analyze_niche, generate_community_blueprint, generate_brand_profile, generate_product_categories, generate_search_keywords, generate_content_strategy, classify_products, analyze_offers, generate_offer_content, generate_launch_campaign, generate_growth_recommendations, generate_image_prompt, generate_image, edit_image, compose_creative. Fila persistente com workspace/community, modelo, input/output, versão, prioridade, estado, tentativas, idempotência, lease, timestamps, uso e erro. Cost Guardian backend com orçamento global por conta compartilhado texto/imagem, reserva transacional, margem inicial 20%, limites por comunidade/modelo, reconciliação, cache por entrada/prompt/schema/modelo/workspace/validade, bloqueio se custo desconhecido. Fallback texto OpenAI autorizado > Cloudflare autorizado > Ollama > template > manual; imagem Cloudflare > ComfyUI > template > manual, somente elegíveis. AI Center e Cost Guardian UI. Tabelas propostas ai_providers, ai_provider_settings, ai_provider_accounts, ai_models, ai_tasks, ai_task_attempts, ai_response_cache, ai_usage_events, ai_usage_reservations, ai_budget_policies, ai_prompt_templates, ai_workers.

**Aceite:** Testar concorrência, quota compartilhada, reserva, cancelamento, retry, cache, isolamento, falha fechada e fallback sem custo.


### Fase 4 — Cloudflare Workers AI — textos

Ferramenta: Codex + Lovable.

**Prompt:** Somente se Fase 2 comprovar transporte e custo elegíveis, integrar REST oficial por fronteira autorizada; Account ID/token em Secrets, menor privilégio, nunca browser. Configurar modelos validados, limites entrada/saída, timeout, concorrência, orçamento, retry/backoff, circuit breaker, healthcheck e uso. Roteamento econômico por tarefa; JSON estruturado validado, sem executar código retornado. Dados externos não confiáveis, sem segredos/PII desnecessários. Cost Guardian obrigatório. Caso gateway Lovable não permita caminho gratuito, manter bloqueado.

**Aceite:** Testes de credencial inválida, modelo indisponível, JSON inválido, timeout, quota, cache, fallback e concorrência texto/imagem. Chamada real só autorizada e comprovadamente gratuita.


### Fase 5 — Image Generation Engine

Ferramenta: Lovable + Codex.

**Prompt:** Adaptadores Cloudflare candidatos @cf/black-forest-labs/flux-1-schnell e @cf/black-forest-labs/flux-2-klein-4b (revalidar IDs, preços, licença, parâmetros e edição); ComfyUI opcional, ManualImageProvider, TemplateImageProvider; GeminiImageProvider/Nano Banana bloqueado. Reusar conta e ledger compartilhado. Image Prompt Engine por nicho/marca/público/objetivo/canal/formato/estilo/composição/luz/espaço negativo/restrições, editável com fallback determinístico. Formatos 1080x1080, 1080x1350, 1080x1920, 1200x628, 1920x1080. IA cria fundos, ilustrações e conceitos; SVG/Canvas sobrepõe foto autorizada real, preço, desconto, cupom, logo, CTA, QR e disclosure. Não alterar produto nem inventar atributos. Image Studio com galeria, histórico, upload, preview, download, favoritos, quota. WebP, thumbnails, hash, dedupe, retenção, MIME/tamanho, direitos. Tabelas image_assets, image_generation_jobs, image_prompt_templates, image_generation_attempts, image_asset_variants, image_asset_usage; reusar AI Core.

**Aceite:** Validar composição fiel, reutilização, limites, isolamento, licenças e fallback; geração real somente autorizada.


### Fase 6 — OpenAI e AI Worker Local

Ferramenta: Codex.

**Prompt:** Revalidar elegibilidade oficial de Sign in with ChatGPT/Codex CLI/SDK para uso pretendido; sem cookies, endpoints privados, API paga ou reaproveitamento indevido de Codex. Se não confirmado, bloquear. Worker Node TS opcional em workers/ai-worker com WorkerClient, TaskRunner, ProviderRegistry, SchemaValidator, CredentialManager, HeartbeatService, UsageGuard, RetryPolicy, StructuredLogger. Registro, autenticação restrita, claim atômico, lease/heartbeat, revogação, resultado/falha, sem service role no worker. Ollama endpoint local e modelos licenciados; ComfyUI workflows aprovados, parâmetros, seed, monitoramento, sem execução arbitrária. Sem exposição pública por padrão. Scripts Win/Linux/macOS, Docker opcional, .env.example sem segredos, diagnóstico e shutdown.

**Aceite:** Testar offline, revogação, lease, rede, fallback e ausência de custo; Cloudflare elegível deve funcionar sem worker. Computador local precisa estar ligado.


### Fase 7 — Community Factory

Ferramenta: Lovable + Codex.

**Prompt:** Wizard rápido com nicho obrigatório, nome opcional, limite, mercados, canais e imagens; avançado público/região/faixa de preço/categorias/tom/marca/horários/modo/restrições. Niche Intelligence distingue hipóteses de dados reais. Blueprint versionado: community_name, alternative_names, slug, niche, positioning, slogan, short/long_description, target_audience, categories/subcategories, search_keywords, negative_keywords, price_preferences, brand_direction, communication_tone, image_strategy, visual_prompt_templates, channel_strategy, marketplace_strategy, content_strategy, launch_plan, publication_rules, compliance_rules, onboarding_tasks. Editar/exportar/importar JSON. Workflow validate_input > analyze_niche > generate_blueprint > create_community > prepare_brand > prepare_image_assets > prepare_channels > prepare_landing_page > prepare_launch_campaign > prepare_search_profiles > prepare_automation_rules > awaiting_review > completed; dependências, retry e logs, sem fingir etapas futuras. Templates automotivo, tech, casa, pets, gamer, bebês, ferramentas, beleza, moda, fitness, livre. Tabelas community_blueprints, community_generation_jobs, generation_steps, niche_templates, niche_analysis, onboarding_tasks.

**Aceite:** Testar Garagem, Radar Tech e nicho livre; imagens opcionais não bloqueiam; aprovação explícita.


### Fase 8 — Brand Studio

Ferramenta: Lovable + Codex.

**Prompt:** Gerar posicionamento, paleta, tipografia, estilo, ícones, slogan, tom, bios e guia editável. IA elegível para moodboards, fundos e conceitos; SVG/Canvas para nome/logo geométrico, versões principal/horizontal/vertical/mono/perfil e export SVG/PNG. Templates premium, minimalista, moderno, tech, comercial, vibrante, auto, esportivo, lifestyle, institucional. Kit lançamento: perfil, story, banner, convite QR, legenda, mensagem e bios. Editor com cores, textos, imagens, posições, preview e download. Garagem: #FF7621, #111318, #F5F5F5; slogan Seu carro merece mais. Seu bolso agradece. Reutilizar fundos, sem regenerar para mudar texto. Tabelas brand_profiles, brand_assets, design_templates, brand_generation_jobs, brand_versions; referenciar image_assets.

**Aceite:** Blueprint aciona rascunho de marca; export e edição reais, sem inventar licença.


### Fase 9 — Landing Page Builder

Ferramenta: Lovable + Codex.

**Prompt:** Rota dinâmica /c/:slug no mesmo app/domínio gratuito se elegível. Hero, logo, benefícios, CTAs WhatsApp/Telegram/Instagram válidos, categorias, ofertas autorizadas para web, FAQ, compartilhamento, disclosure, privacidade e rodapé. Editor de seções, ordem, visibilidade, cores, imagens, SEO/OG e preview. Draft/published/archived, versionamento, somente campos públicos aprovados. Lazy load, imagens comprimidas, cache autorizado. Eventos page_view, whatsapp_click, telegram_click, instagram_click, offer_click, share_click, UTM; cliques não são membros/vendas. Tabelas landing_pages, landing_page_versions, landing_page_sections, analytics_events.

**Aceite:** Rascunho automático após marca, publicar somente autorizado; testar slug, isolamento, mobile, expiração e privacidade.


**Ampliação V4.0:** Ampliar para Storefront Builder: vitrine pesquisável, categorias/filtros, destaque, cupons válidos, expiração automática quando scheduler elegível, SEO e disclosure; sem checkout próprio, dados de marketplace somente autorizados.

### Fase 10 — Channel Hub

Ferramenta: Lovable + Codex.

**Prompt:** ChannelProvider getCapabilities, validateConnection, getConnectionStatus, prepareContent, publishContent, disconnect. WhatsAppManualProvider: nome, descrição, foto, regras, boas-vindas, convite, criação/admin manual, copiar/compartilhar/confirmar; grupos oficiais somente se elegíveis, sem Baileys/Evolution/WhatsApp Web não oficial. TelegramProvider: canal criado manualmente, BotFather, bot admin, token/chat_id em backend, teste autorizado, texto/imagem/botão/message_id. InstagramManualProvider: conta profissional manual, bio, foto, posts/stories/legendas; Graph API somente autorizada. LandingPageProvider: publicar/atualizar/expirar. Múltiplos destinos, status not_configured/pending_setup/connected/manual_only/error/disabled, checklists, logs, disconnect. Atualizar landing e reusar ativos.

**Aceite:** Testar permissões, credenciais inválidas, conexão real autorizada, modo manual e ausência de automação fictícia.


**Ampliação V4.0:** Ampliar Channel Hub: múltiplas contas/destinos, healthcheck, status e reconciliação, limites por destino; Instagram Engagement Agent comentário por palavra-chave → resposta/DM somente com API oficial, permissões, janela e consentimento aplicáveis; sem spam. WhatsApp permanece manual/oficial elegível.

### Fase 10.1 — Affiliate Capture Extension (antecipada)

Ferramenta: Codex + Lovable se backend gerenciado necessário.

**Prompt:** Implementar extensão própria Manifest V3 TypeScript, React side panel opcional, instalação local sem taxa de loja. Captura individual e lote apenas onde permitido, acionada pelo usuário, preview de título/preço/imagem/URL/cupom/fonte/data, seleção de comunidade, importação de link oficial já gerado, confirmação, dedupe e fila de revisão. Permissões por domínio mínimas e opcionais, sem cookies, sessão de marketplace, tokens privados, interceptação de credenciais ou endpoints não oficiais. Autenticação restrita do Hub com revogação, server routes TanStack autenticadas, validação Zod, RLS, SSRF, limites, idempotência e auditoria; sem service role na extensão. Se termos impedirem captura, usar formulário manual. Solicitar Lovable para schema gerenciado. Reusar importação no Offer Hunter.

**Aceite:** instalação local, permissões revisadas, captura autorizada ou fixture identificada, importação manual, isolamento, revogação, duplicata, erros, nenhuma publicação automática; sem taxa ou integração não autorizada.

### Fase 11 — Offer Hunter

Ferramenta: Codex + Lovable.

**Prompt:** MarketplaceProvider getCapabilities, getConnectionStatus, searchProducts, getProductDetails, getTrendingProducts, getPromotions, getCommissionInformation, validateOffer, generateAffiliateLink. Adaptadores ML/Shopee/Amazon independentes, APIs/feeds/relatórios oficiais autorizados; importação manual URL/CSV/JSON; mock só testes. Sem scraping proibido, bypass de CAPTCHA ou autenticação. SearchProfile categorias, keywords/negativas, preço, mercados, frequência, critérios, sazonalidade. Tendências reais com fonte; hipóteses rotuladas. Calendário Black Friday, Natal, Dia das Mães/Pais, volta às aulas e nicho, sem inventar datas de marketplace. Produto: ID externo, título, descrição/imagem/URL permitidos, preço atual/referência, moeda, rating/count, demanda, estoque, vendedor, comissão, cupom, fonte, instante, validade, restrições; desconhecido null. Normalizar, deduplicar, histórico permitido, expirar, retenção. IA em lote classifica/expande keywords, não inventa fatos. Radar filtros, tabela/grid, importação, histórico. Tabelas products, offers, community_offers, search_profiles, discovery_runs, discovery_sources, price_history, marketplace_capabilities, marketplace_data_policies, trend_observations, seasonal_events. Validar URL/redirect/SSRF.

**Aceite:** Testar importação real, dedupe, fonte, validade, dados ausentes e restrições de armazenamento.


**Ampliação V4.0:** Marketplace Intelligence Engine: separar DiscoveryProvider, ProductProvider, AffiliateLinkProvider e CouponProvider. Ranking com fonte/período/categoria; busca por URL/keyword, importação extensão/lote, catálogo normalizado. Coupon Intelligence: código, elegibilidade, mínimo, teto, validade, cumulatividade comprovada, preço efetivo determinístico, fonte e revalidação; tabelas propostas coupons, coupon_observations, offer_coupons. Sem inferir desconto ou disponibilidade.

### Fase 12 — Affiliate Intelligence

Ferramenta: Lovable + Codex.

**Prompt:** Offer Score determinístico 0–100: desconto 25, relevância 20, qualidade 15, comissão 15, demanda 15, histórico 10; pesos editáveis somam 100. Cobertura/confiança separadas, ausentes não inventados; baixa cobertura exige revisão. >=75 elegível, 60–<75 revisão, <60 rejeição. IA explica relevância e riscos; cálculos em código. Affiliate Manager contas/aprovação/IDs, links manuais ou oficiais, domínio/validade/histórico/restrições; formato não prova tracking. Bloquear preço não confirmado, expiração, estoque indisponível, link não autorizado, duplicata, fonte fraca e canal proibido. Central de aprovação individual/lote com preço, desconto, comissão, score, confiança, motivo, data e revalidação. Tabelas affiliate_accounts, affiliate_links, affiliate_link_validations, offer_scores, scoring_profiles, offer_validations, offer_approvals, compliance_rules.

**Aceite:** Modo assisted padrão; automático somente após todos os gates, auditado. Testar score, cobertura, links, expiração e bloqueios.


**Ampliação V4.0:** Link Intelligence: links oficiais/importados por conta, campanha/canal, validação de destino e atribuição quando comprovável; encurtador/redirecionamento próprio somente se permitido pelo programa, allowlist e sem open redirect, sem mascarar destino ou modificar tracking; fallback link direto. Eventos de clique com privacidade e dedupe, sem confundir clique e conversão.

### Fase 13 — Content Engine

Ferramenta: Lovable + Codex.

**Prompt:** AI Core gera títulos, legendas, CTA, benefícios comprovados, convites, editorial e variantes em lote/cache/templates. Modos Template SVG/Canvas, Hybrid AI padrão (fundo IA + foto autorizada + dados reais), Creative AI institucional. Biblioteca de fundos por comunidade/categoria, limite de novas imagens/dia. WhatsApp texto curto/preço/cupom/CTA/link/disclosure; Telegram texto/imagem/botão/validade; Instagram quadrado/vertical/carrossel/story/legenda/convite/disclosure; landing card com preço e data de validação. Tipos oferta, achadinho, destaque, cupom, comparação factual, lista, resumo diário, sazonal, educativo, convite. Sem falsos preços, avaliações, benefícios, urgência, cupons ou direitos de imagem. Editor, preview, exportar/copiar, aprovação e calendário. Tabelas content_templates, content_assets, content_versions, content_approvals, content_generation_jobs, editorial_calendars; referenciar ativos.

**Aceite:** Acionar após oferta aprovada; testar fidelidade dos dados, disclosure, formatos e fallback.


### Fase 14 — Automation & Publisher

Ferramenta: Codex + Lovable.

**Prompt:** Pipeline descoberta > normalização > validação > score > link > texto > criativo > aprovação > agenda > publicação > métricas. PostgreSQL jobs com prioridade, agenda, dependências, lease, retry/backoff, dead letter, cancelamento, idempotência e recuperação. Scheduler gratuito validado ou manual/local; sem background presumido. Tipos discover_offers, normalize_products, validate_offers, calculate_scores, resolve_affiliate_links, generate_content, generate_image_prompt, generate_image, compose_creative, schedule_publications, publish_content, expire_offers, collect_metrics, generate_daily_summary, cleanup_assets. Limite transacional de ofertas únicas/dia e separado por canal, janelas/fuso, intervalo, score, dedupe, aprovação, tarefas IA/imagens/storage. Telegram automático autorizado com IDs; landing automática autorizada e expiração; WA/IG manual ou oficial elegível. Revalidar preço/estoque/link/validade/canal/limite/pausa/duplicata, TTL de confirmação manual. Cost Guardian prioriza essencial, reutiliza e pausa. Kill switch global/comunidade/canal, dry run, anti-spam, reconciliação de timeout sem retry cego. UI agenda/fila/jobs/histórico/erros. Tabelas jobs, job_attempts, job_dependencies, publication_queue, publications, daily_offer_counters, automation_schedules, automation_runs.

**Aceite:** Testar cap 20 únicos, concorrência, dedupe cross-channel, pausa, isolamento, dry run e entrega incerta.


**Ampliação V4.0:** Ampliar fila operacional com regras por marketplace/categoria/cupom/comissão, múltiplos destinos, preview, edição em lote, pausa, limite de frequência e saúde de conexão. Nenhum disparo sem aprovação e capacidade elegível.

### Fase 15 — Growth Analytics e Orquestrador

Ferramenta: Codex + Lovable.

**Prompt:** Supervisor planeja dependências, chama serviços tipados pré-autorizados, valida, limita, audita e consolida; sem execução arbitrária. Criação: nicho > blueprint > comunidade > marca > imagens > landing > canais > campanha > busca > marketplaces > regras > pendências > aprovação > publicação/automação elegível. Operação: descobrir > normalizar > classificar > validar > score > link > conteúdo > imagem/reuso > compor > aprovar > agendar > publicar > métricas > recomendar. Estados pending/running/awaiting_provider/awaiting_credentials/awaiting_human_action/awaiting_approval/rate_limited/partially_ready/completed/failed/paused/cancelled; mapear aos estados existentes. Etapas independentes prosseguem; fila humana com instruções precisas. Command Center progresso/agentes/pendências/runs/eventos/falhas/limites/pausa. Métricas reais por comunidade/nicho/categoria/marketplace/produto/canal/hora/período/campanha/template/criativo: ofertas, aprovações, posts, cliques, conversões reportadas, comissões estimadas/pendentes/aprovadas/pagas/canceladas, erros, consumo, imagens novas/reusadas. CSV/JSON autorizado, dedupe/proveniência. Recomendações IA com dados mínimos e distinção observação/hipótese/recomendação; mudanças aprovadas. Campanhas orgânicas, QR/UTM, sem compra de ads. Tabelas workflows, workflow_runs, workflow_steps, workflow_dependencies, agent_runs, human_action_requests, orchestration_events, campaigns, conversions, commissions, performance_snapshots, growth_recommendations.

**Aceite:** Testar três nichos, provedores indisponíveis, quota compartilhada, worker offline, marketplace sem API, conta não aprovada, canal desconectado, expiração, link inválido, storage, duplicata, pausa/retomada. Auditoria final segurança, performance, acessibilidade, dependências, custos, testes e operação; reportar manual/bloqueado/real.

**Ampliação V4.0:** Ampliar analytics por origem, campanha, link, cupom, vitrine, destino e criativo; atribuição apenas quando comprovada. Colaboração futura: convites e papéis protegidos, autorização explícita e isolamento; não liberar papéis por metadata editável.

### Fase 16 — Affiliate Capture Extension: evolução

Ferramenta: Codex + Lovable se necessário.

**Prompt:** Revisar Fase 10.1, ampliar fontes autorizadas, UX de lote, mapeamento de campos, recuperação offline sem segredos, testes de compatibilidade e auditoria. Publicação em loja somente com autorização e custo comprovadamente zero; instalação local padrão.

**Aceite:** não duplicar extensão, regressão e segurança validadas.

### Fase 17 — Video Studio

Ferramenta: Codex + Lovable.

**Prompt:** Roteiros, storyboard, legendas, slideshow vertical, narração local licenciada opcional e composição FFmpeg em worker local separado; imagens reais autorizadas, templates, preview, export, limites de storage/CPU, aprovação. Sem API de vídeo paga, sem fingir UGC real ou testemunho, sem voz/imagem sem autorização.

**Aceite:** vídeo local exportável, fallback manual, licenças, limites e nenhuma cobrança.

### Fase 18 — Mobile PWA

Ferramenta: Codex.

**Prompt:** PWA responsiva instalável, manifesto, fila e aprovação móvel, cache apenas de ativos públicos autorizados, limpeza no logout, sem cache de tokens/dados privados, offline claramente indicado. Notificações somente opt-in e elegíveis.

**Aceite:** instalação e navegação móvel, isolamento, offline e logout seguros.

### Fase 19 — Expansão de marketplaces

Ferramenta: Codex + Lovable.

**Prompt:** Investigar AliExpress e outras redes por capacidade oficial, região, aprovação, custos, termos e canais; implementar adaptadores elegíveis somente após autorização, sem alterar contratos centrais. Fallback manual, testes e matriz atualizada.

**Aceite:** integração real autorizada ou bloqueio explícito; nenhum custo adicional.

### Fase 20 — WordPress e integrações externas

Ferramenta: Codex + Lovable.

**Prompt:** Exportação de vitrine e integração WordPress opcional via API oficial, instalação existente sem hospedagem paga obrigatória, credencial restrita, revogação, validação, idempotência, expiração, logs e fallback export manual. Colaboração opcional com convites e papéis protegidos se ainda pendente.

**Aceite:** publicação autorizada ou export manual, segurança e custo zero comprovados; sem contratação.

## Prompt de checkpoint entre fases — Codex
Atue como revisor independente. Leia AGENTS.md, PROJECT_STATUS.md, PROJECT_MASTER_GUIDE.md, PRD, arquitetura, banco, segurança, política financeira e documentos da fase recém-entregue. Compare critérios de aceite com código, migrations gerenciadas e evidências; diferencie real, parcial, mock e não implementado. Verifique arquitetura, dependências, TypeScript, React, autenticação, RLS, FKs, isolamento, autorização, secrets, tratamento de erros, responsividade, acessibilidade, concorrência, idempotência, filas, limites, custo, permissões e licenças. Para Fase 1 verifique login/cadastro/reset/logout/perfil/workspace/CRUD/seletor/dashboard/configurações/seed Garagem/segundo nicho. Identifique APIs inventadas, bypass do AI Core, ledger separado texto/imagem, preços gerados por IA, produto alterado, Nano Banana habilitado indevidamente, compra automática ou exposição de tokens. Rode bun install --frozen-lockfile, bun run lint, bun run test, bun run build e verificação de tipos quando disponíveis; não alegue execução se não ocorreu. Testes de integração somente com contas temporárias autorizadas, limpeza verificada; sem acesso marque pendente. Corrija apenas escopo autorizado, preserve design e solicite Lovable para recursos gerenciados. Crie docs/PHASE_XX_VALIDATION.md com resumo, critérios, evidências, arquivos, testes, falhas, correções, riscos, pendências e parecer APPROVED/APPROVED_WITH_WARNINGS/BLOCKED. Atualize PROJECT_STATUS.md. Não avance automaticamente. Ressalvas financeiras bloqueiam habilitação de serviços e produção; investigação documental da Fase 2 pode ser autorizada separadamente.

## Prompt de revisão técnica Codex após Lovable — Codex
Revise diff da última fase, AGENTS.md, status, arquitetura, custo, provedores, imagens e marketplaces. Aplique o checkpoint acima com foco em regressões, código reutilizável, segurança, RLS, credenciais, dependências, performance, acessibilidade, filas, concorrência, idempotência, testes e ausência de APIs falsas. Verifique Cost Guardian backend compartilhado, fallback gratuito, reutilização de imagens e composição determinística com dados reais. Corrija somente código não gerenciado da fase, sem regressão visual; solicite Lovable para schema/secrets/gerados. Reporte arquivos, migrations necessárias, testes, aceite, limitações e go/no-go. Não implemente fase seguinte.

## Prompt de recuperação de contexto — Codex (copiar no início de nova sessão)
Leia AGENTS.md, README.md, docs/PROJECT_MASTER_GUIDE.md, docs/PROJECT_STATUS.md, docs/ROADMAP.md, docs/ARCHITECTURE.md, docs/ZERO_COST_POLICY.md e documentos da fase atual. Inspecione branch, commits, alterações não commitadas, código e migrations relevantes. Determine última fase autorizada e concluída, funcionalidades reais, pendências, riscos, decisões, testes registrados e próximos critérios. Preserve arquitetura TanStack/Lovable gerenciada, multi-nicho, custo adicional zero, Cloudflare texto/imagem com quota compartilhada se elegível, OpenAI somente oficialmente autorizado, Nano Banana bloqueado, worker local opcional e fallback manual/templates. Não recrie projeto, não altere código nem avance fase. Resuma o estado, indique o próximo prompt deste guia e aguarde minha autorização.

## Marcos de entrega
MVP 1 fases 0–3 (inclui 2.1): base e controle de custo; MVP 2 fases 4–6: IA elegível e contingências; MVP 3 fases 7–10.1: fábrica de comunidades; MVP 4 fases 11–13: ofertas, afiliados e conteúdo; MVP 5 fases 14–15: automação e crescimento; MVP 6 fases 16–20: expansão operacional. Ordem não autoriza execução automática. Fases futuras dependem de viabilidade, contas aprovadas, permissões e quotas. Sem integração autorizada, entregar modo manual explicitamente identificado.

## Registro de decisões
- 25/11/2026: fundação real usa Lovable Cloud/TanStack, divergente do briefing Supabase Free/Edge Functions; gate financeiro pendente.
- 26/11/2026: guia consolidado a partir do planejamento V3.0 e arquivos reais; prompts reconstituídos e adaptados, não transcrição literal. Nenhuma fase implementada por este commit.
- Próximas decisões: resultado da Fase 2, hard cap, transporte IA permitido, arquitetura de hospedagem, aprovação de afiliados, canais e licenças. Registrar decisões novas aqui e no status.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Complemento obrigatório dos prompts: Fases 2/2.1 validar capacidades SenaFlow separando evidência UI de documentação oficial; 7 blueprint de grupos operacionais; 9 páginas ponte como landing pages de aquisição (hipótese); 10 múltiplos destinos e saúde; 10.1 extensão assistida seleciona grupos sem disparar; 11 Grupos de Disparo e regras versionadas, Puxar Produtos usa configuração vigente, mesma pipeline da agenda, Guia de Filtros por capacidade, keywords obrigatórias OR e proibidas, preço/desconto/vendas/comissão e política explícita de ausentes; 12 filtros antes do score e revisão de dados ausentes; 13 convite com {link}, imagem licenciada e preview; 14 Produção e Fila de Disparo com contadores reais, grid/lista, filtros, busca, reordenação/embaralhar, negativas, exclusão confirmada, limpar enviados sem apagar auditoria, Disparar agora apenas após gates, agenda de convites e pausa; 15 métricas de coleta/filtros/fila/convites. Checkpoint testa paridade manual/agenda, versão, ausentes, isolamento, dedupe, contadores, link por destino, limites e revalidação. Sem cookies, sessões privadas ou custos pagos. Ler COMPETITIVE_BENCHMARK.md e complementos dos documentos. Ordem e autorização inalteradas.
