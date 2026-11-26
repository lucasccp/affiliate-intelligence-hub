# Affiliate Intelligence Hub

Fábrica inteligente de comunidades de ofertas para programas de afiliados, com configuração independente por nicho e controle central de consumo.

**Fundação implementada na main. Piloto e Fase 3 assistida disponíveis em develop.** Login, perfil, workspace pessoal, dashboard, CRUD de comunidades e configurações utilizam persistência real. A automação de fases futuras segue pendente; não há inferência de IA, publicação ou conexão com marketplaces/canais.

**Orçamento adicional autorizado: R$ 0,00.** Lovable Cloud foi conectado nesta fase. Compras automáticas estão desativadas, mas o serviço pode consumir créditos existentes após a franquia; nenhum limite de bloqueio Cloud foi encontrado. Não há garantia de custo operacional zero certificada. A assinatura ChatGPT/Codex não é uma API gratuita presumida. Consulte a [política financeira](docs/ZERO_COST_POLICY.md).

## Branch de desenvolvimento

Use `develop` como referência única para código, documentação e preview no Lovable. As branches de fase preservam o histórico das entregas. Para testar, confirme a sincronização da branch e o ambiente do banco. Em Comunidades, selecione Garagem de Ofertas com uma conta de teste proprietária ou administradora. Use as abas Ofertas e Conteúdo para alternar entre o piloto e o painel assistido.

[Status atual](docs/PROJECT_STATUS.md) · [Checkpoint da Fase 3 assistida](docs/PHASE_03_ASSISTED_VALIDATION.md)

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [PRD](docs/PRD.md) | Produto, escopo e aceite |
| [Arquitetura](docs/ARCHITECTURE.md) | Decisões, agentes, workflows e divergências de stack |
| [Dados](docs/DATABASE.md) | Modelo conceitual e isolamento planejado |
| [Roadmap](docs/ROADMAP.md) | Fases sujeitas a autorização explícita |
| [Segurança](docs/SECURITY.md) | Ameaças, controles e testes futuros |
| [Integrações](docs/INTEGRATIONS.md) | Pré-requisitos e fronteiras |
| [Custo zero](docs/ZERO_COST_POLICY.md) | Bloqueios, franquias e Cost Guardian |
| [IA textual](docs/AI_PROVIDERS.md) | Contratos e elegibilidade |
| [Imagens](docs/IMAGE_GENERATION.md) | Provedores e preços verificados |
| [Marketplaces](docs/MARKETPLACE_CAPABILITIES.md) | Matriz de capacidades a validar |
| [Status](docs/PROJECT_STATUS.md) | Evidências, riscos e pendências |

As regras técnicas permanentes estão em [AGENTS.md](AGENTS.md). A lista desta entrega está em [roadmap.md](roadmap.md).

## Base existente

React 19, TypeScript, TanStack Start, Tailwind CSS v4, shadcn/ui, Zod e Vitest. Lovable Cloud fornece autenticação e PostgreSQL. Dependências de conexão e migrations foram adicionadas pela plataforma; versões efetivas constam de `package.json` e `bun.lock`.

O pedido original menciona Supabase Free e Supabase Edge Functions. Foi usado o backend gerenciado Lovable Cloud e funções de servidor TanStack, não um projeto externo Free nem Edge Functions. Essa divergência e o risco de créditos estão registrados na arquitetura e no status; não são planos financeiramente equivalentes.

## Acesso e recursos

`/` direciona para `/auth` ou `/dashboard` conforme a sessão. Páginas protegidas: `/dashboard`, `/comunidades`, `/configuracoes`. Recuperação em `/reset-password`, pública e vinculada a sessão de recuperação válida.

O cadastro cria perfil, workspace pessoal e **Garagem de Ofertas** em rascunho, com configuração literal do piloto nas migrations. Cada usuário recebe seus próprios registros; os destinos continuam não configurados. Novos nichos não herdam categorias automotivas. Interface clara/escura, menu recolhível/mobile, filtros, paginação de 8 itens, toasts, skeletons, estados vazios e erros estão disponíveis.

## Desenvolvimento local

Com dependências já disponíveis: `bun run dev`. Para uma instalação nova: `bun install` a partir do lockfile. Não inserir segredos em código ou arquivos versionados.

Comandos existentes: `bun run test`, `bun run lint`, `bun run build`. Não há script dedicado de typecheck. Nesta sessão Lovable, build e verificação de tipos são responsabilidade do ambiente; não foram executados manualmente. Resultados da entrega constam em `docs/PROJECT_STATUS.md`.

Testes de integração reais: `bunx vitest run src/test/hub-rls.integration.test.ts`, somente com o ambiente de teste contendo as variáveis de conexão fornecidas pela plataforma. Sem elas, o arquivo é ignorado. O teste cria contas isoladas, valida o banco real e verifica a limpeza, sem mostrar credenciais. Não executar contra um ambiente sem autorização para contas temporárias.

## Próximo passo

Revisar a Fase 1 e suas ressalvas no status. Confirmação e recuperação por e-mail exigem endereço real e ainda não foram verificadas ponta a ponta. O limite financeiro Cloud permanece pendente. Não avançar à Fase 2, habilitar IA ou alterar faturamento automaticamente.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Planejamento vigente: [manual mestre V4.0](docs/PROJECT_MASTER_GUIDE.md), [roadmap](docs/ROADMAP.md), [benchmark](docs/COMPETITIVE_BENCHMARK.md). SenaFlow inspira grupos, coleta, fila, convites, extensão e páginas ponte: requisitos futuros. Codex lê AGENTS.md, manual mestre e status antes de executar; autorizar uma fase por vez. Próxima Fase 2, pesquisa e viabilidade; gate financeiro pendente.
