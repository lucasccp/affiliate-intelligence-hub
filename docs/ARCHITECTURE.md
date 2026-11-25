# Arquitetura inicial

**Status: arquitetura da Fase 0 preservada como referência; fundação da Fase 1 implementada conforme atualização abaixo.**

## Atualização da Fase 1

- Lovable Cloud conectado com PostgreSQL e Auth. Não é a oferta externa Supabase Free do briefing; o custo é baseado em créditos da plataforma. Nenhum hard cap Cloud foi encontrado, portanto o gate financeiro de custo zero continua não certificado.
- Páginas de autenticação públicas e `/dashboard`, `/comunidades`, `/configuracoes` sob uma única fronteira `_authenticated`. Layout client-only valida usuário; server functions usam `requireSupabaseAuth`, sessão autenticada e RLS.
- Funcionalidades isoladas em `src/components/hub`; schemas determinísticos e fronteiras em `src/lib/hub-schema.ts`, `hub.functions.ts` e `hub-query.ts`. TanStack Query carrega o workspace e invalida leituras após alterações.
- Migrations geradas/aplicadas em `drizzle/migrations/` pelo mecanismo gerenciado. Cadastros criam perfil, associação protegida, workspace pessoal e seed literal idempotente do piloto. Nenhuma página cria seed.
- Configurações relacionadas de uma comunidade são gravadas atomicamente por SQL invoker `save_community`. RLS protege cada tabela; FKs compostas impedem referências entre workspaces. Triggers validam limites e geram auditoria.
- Apenas cadastro/configuração: modos automatic/assisted não executam jobs, canais e marketplaces não se conectam, agentes e Cost Guardian de inferência continuam futuros. Não há scheduler, polling, Realtime ou chamada de IA.

As seções seguintes descrevem a inspeção e proposta originais da Fase 0; o estado executável atual consta de PROJECT_STATUS.md.

## Inspeção da base

Template TanStack Start com React/TypeScript, Tailwind v4, componentes shadcn, Zod, TanStack Query e Vitest. Há router, layout raiz com Outlet, página inicial placeholder, proteção CSRF para server functions e captura de erros. Não há backend conectado, schema de domínio, agentes ou integrações.

## Decisões e divergências

| Decisão | Motivo / consequência |
| --- | --- |
| Preservar TanStack Start e componentes existentes | Plataforma fixa; não introduzir outro router/framework |
| Serviços tipados, não processos autônomos por agente | Menos consumo, contratos auditáveis e execução limitada |
| PostgreSQL como estado e fila inicial | Evitar Redis, Kubernetes e infraestrutura obrigatória adicional |
| Backend somente após confirmação de gratuidade e autorização | Não presumir Lovable Cloud equivalente a Supabase Free |
| Funções internas TanStack; rotas de servidor para callbacks | Supabase Edge Functions do briefing não são a fronteira suportada neste ambiente |
| Provedores desacoplados e bloqueados por padrão | Não ligar um SDK e descobrir custo depois |
| Manual/templates são contingência operacional | Produto continua com escopo reduzido quando automação não for gratuita |
| Node/Ollama/ComfyUI em processo local opcional | Hospedagem serverless não executa modelos locais ou daemon persistente |

O bloco gerenciado de AGENTS.md também direciona chamadas de modelos ao gateway da plataforma. Isso não certifica um caminho gratuito para Cloudflare ou modelos locais: os contratos descrevem capacidades desejadas, não autorização de transporte direto. Antes de implementar IA, verificar se existe encaminhamento oficialmente suportado sem custo adicional; caso contrário, manter adaptadores bloqueados e usar manual/templates. Nenhuma chamada ao gateway ou bypass foi implementado.

Conexão a projeto externo gratuito, se escolhida futuramente, depende de ação do administrador nas configurações do projeto. Nada foi conectado. Se não existir opção verificavelmente gratuita e compatível, a fase de backend fica bloqueada; não substituir silenciosamente por serviço pago.

## Camadas propostas

```text
Interface administrativa / landing pages aprovadas
                    |
Fronteira de servidor: autenticação + autorização + validação
                    |
Supervisor / máquina de estados de workflows
        |                  |                  |
Serviços de domínio   Cost Guardian      Registro de capacidades
        |                  |                  |
Contratos de provedores e adaptadores elegíveis (futuros)
                    |
PostgreSQL: comunidades, tarefas, reservas, aprovações, auditoria
Storage privado: artefatos e imagens autorizados (futuro)
```

Estrutura sugerida para implementação autorizada: `src/features/communities`, `src/domain/workflows`, `src/domain/cost`, `src/domain/offers`, `src/providers/contracts`, `src/lib/*.functions.ts` para fronteiras RPC e helpers `*.server.ts`. São caminhos propostos, não arquivos entregues. Route loaders não acessam segredos; chamam fronteiras de servidor. Código Node exclusivo não entra no grafo SSR.

## Agentes e contratos de responsabilidade

| Serviço | Entrada | Saída / condição de sucesso |
| --- | --- | --- |
| Supervisor Agent | Objetivo, comunidade, versão de configuração | Plano de etapas e transições válidas; não concede privilégios |
| Niche Intelligence Agent | Nicho, fontes permitidas | Público, tendências e análise com origem e incerteza |
| Community Builder Agent | Análise aprovada | Configuração isolada em rascunho |
| Brand Designer Agent | Posicionamento e preferências | Nome, paleta, tipografia e instruções de marca |
| Image Creator Agent | Briefing, licença e orçamento | Artefato com proveniência ou bloqueio de franquia |
| Landing Page Agent | Marca, ofertas e divulgação afiliada | Conteúdo/estrutura em rascunho; publicação é outra etapa |
| Channel Setup Agent | Canal desejado e capacidades | Checklist/configuração; espera autorização externa |
| Offer Hunter Agent | Fontes, categorias e janela | Candidatos com fonte, preço e instante de observação |
| Offer Intelligence Agent | Candidatos e regras | Deduplicação, validação, ranking e sazonalidade |
| Affiliate Manager Agent | Conta aprovada e produto | Link oficial ou importado, nunca fabricado |
| Content Creator Agent | Oferta validada, marca e canal | Conteúdo em rascunho com disclosure |
| Publisher Agent | Conteúdo aprovado e autorização | Resultado confirmado ou falha/estado desconhecido |
| Growth Agent | Métricas reais e objetivo | Sugestões versionadas, sem mudança de limites por conta própria |
| Cost Guardian | Operação, conta e estimativa | Reserva autorizada, contingência gratuita ou bloqueio |

Ranking, filtros, horário, deduplicação, validação de URLs, regras de aprovação e consumo usam lógica determinística. IA auxilia análise e criação; não decide permissões, pagamentos ou veracidade do preço.

## Contrato conceitual de execução

```typescript
// Especificação documental; não compilada nem implementada.
type StepState =
  | 'pending' | 'running' | 'waiting_human' | 'paused_quota'
  | 'succeeded' | 'failed' | 'cancelled';
type HumanReason = 'authorization' | 'configuration' | 'approval' | 'technical_limit';
type Outcome<T> =
  | { kind: 'success'; data: T; artifactIds: string[] }
  | { kind: 'human_required'; reason: HumanReason; action: string }
  | { kind: 'paused'; code: 'QUOTA' | 'COST_POLICY' | 'UNAVAILABLE' }
  | { kind: 'failure'; code: string; retryable: boolean };
interface AgentContext {
  workspaceId: string;
  communityId: string;
  workflowId: string;
  stepId: string;
  configVersion: number;
  idempotencyKey: string;
}
interface AgentService<Input, Output> {
  execute(input: Input, context: AgentContext): Promise<Outcome<Output>>;
}
```

Implementação futura acrescenta schemas Zod de entrada/saída, política de timeout, identidade autorizada e referência de reserva. IDs e versão de configuração são validados contra a sessão e o banco, nunca confiados porque vieram do browser.

## Workflow, execução e retomada

Pipeline: nicho → comunidade/marca → imagens/landing → configuração de canais → descoberta → inteligência de ofertas → afiliados → conteúdo → aprovação → agenda → publicação → métricas → otimização. Etapas opcionais dependem de capacidades; ausência não gera sucesso fictício.

`pending → running → succeeded`; `running` pode ir para `waiting_human`, `paused_quota` ou `failed`. Retomada exige resolução registrada e retorna a `pending`. Cancelamento invalida execução/reserva ainda não consumida. Falha transitória recebe retry com limite; falha de política não recebe retry automático. Conclusão do workflow depende de todas as etapas obrigatórias, não de um log textual do Supervisor.

Claim transacional de tarefa com lease, prazo de execução, heartbeat quando viável e tentativa contada. Configurações são versionadas. Scheduler futuro depende de recurso gratuito validado; sem ele, disparo manual. Não presumir execução em background após resposta HTTP.

Efeitos externos usam idempotência quando o serviço suporta. Timeout de publicação implica estado de entrega desconhecido e reconciliação, não retry cego. Se serviço não oferecer confirmação/idempotência, exigir intervenção para evitar posts duplicados. Não prometer exactly-once entre banco e API externa.

## Limitações

Workers possuem limites de execução, memória e requisições separados da franquia de IA. Dependências precisam funcionar no runtime e ser empacotadas; não depender de módulos Node resolvidos em tempo de execução, filesystem persistente, SSR externo ou daemons. Integração do token/binding de Cloudflare com a hospedagem atual não foi validada. Plano gratuito, permissões e cotas só podem ser confirmados na conta real em fase autorizada.