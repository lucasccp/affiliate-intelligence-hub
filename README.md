# Affiliate Intelligence Hub

Fábrica inteligente de comunidades de ofertas para programas de afiliados, com configuração independente por nicho e controle central de consumo.

**Estado: Fase 0 — documentação e arquitetura inicial.** Não há agentes executáveis, banco conectado, geração por IA, publicação ou integrações reais. A tela inicial continua sendo o template; não representa um produto implementado.

**Orçamento adicional autorizado: R$ 0,00.** Nenhum serviço foi ativado por esta entrega. A assinatura ChatGPT/Codex não é uma API gratuita presumida. Consulte a [política financeira](docs/ZERO_COST_POLICY.md).

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

React 19, TypeScript, TanStack Start, Tailwind CSS v4, shadcn/ui, Zod e Vitest. PostgreSQL e backend são planejados, não provisionados. Versões efetivas são as de `package.json` e `bun.lock`; não houve atualização de dependências.

O pedido original menciona Supabase Free e Supabase Edge Functions. A plataforma atual exige fronteiras de servidor TanStack e não implementa Edge Functions desse serviço. A decisão sobre conexão e gratuidade do backend deverá preceder a Fase 1; nenhuma equivalência de planos é presumida.

## Desenvolvimento local

Com dependências já disponíveis: `bun run dev`. Para uma instalação nova: `bun install` a partir do lockfile. Não inserir segredos em código ou arquivos versionados.

Comandos existentes: `bun run test`, `bun run lint`, `bun run build`. Não há script dedicado de typecheck. Nesta sessão Lovable, build e verificação de tipos são responsabilidade do ambiente; não foram executados manualmente. Resultados da entrega constam em `docs/PROJECT_STATUS.md`.

## Próximo passo

Revisar os critérios de aceite da Fase 0 e autorizar expressamente a próxima fase. Esta entrega não autoriza provisionamento, uso de IA, publicação ou alteração de faturamento.
