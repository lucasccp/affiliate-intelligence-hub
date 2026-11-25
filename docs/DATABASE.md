# Modelo de dados conceitual

**Nenhuma tabela, migration, policy RLS, função SQL ou dado piloto foi criado.** Este documento orienta migrations incrementais futuras.

## Hierarquia

Workspace representa a conta administrativa; comunidade é a unidade operacional multi-nicho. Usuário poderá participar de workspace; acesso à comunidade depende da associação correspondente. É uma proposta que deve ser confirmada antes da implementação de papéis.

```text
workspace → memberships
workspace → communities → configurações versionadas
                      → fontes / contas afiliadas / canais
                      → ofertas → links → conteúdos → publicações
                      → workflows → steps → jobs → approvals
workspace → provider_accounts → quota_buckets → reservations → usage_events
workspace / community → artifacts / metric_events / audit_events
```

## Entidades propostas

| Entidade | Campos principais / invariantes |
| --- | --- |
| workspaces | id, nome, owner_user_id, timestamps |
| workspace_memberships | workspace_id, user_id, papel; associação única |
| communities | id, workspace_id, nicho, status; nenhuma coluna/regra exclusiva do piloto |
| community_memberships | workspace_id, community_id, user_id, papel; referência ao mesmo workspace |
| community_config_versions | community_id, versão, marca, público, categorias, estratégias, identidade, agenda, limites, aprovação; versão única e schema validado |
| marketplace_sources | workspace_id, community_id, marketplace, capacidade, origem, checked_at, estado de autorização |
| affiliate_accounts | workspace_id, community_id, programa, status, secret_ref; nunca token em texto público |
| channels | workspace_id, community_id, tipo, identificador externo, autorização, secret_ref |
| products / offers | workspace_id, community_id, origem, id externo, título, moeda, preço, disponibilidade, observed_at, expires_at, source_url |
| affiliate_links | workspace_id, community_id, offer_id, account_id, URL, origem oficial/manual, checked_at |
| contents | workspace_id, community_id, offer_id, canal, versão, texto, disclosure, status |
| publications | workspace_id, community_id, content_id, scheduled_at, external_id, delivery_state, idempotency_key |
| workflows / workflow_steps | workspace_id, community_id, tipo, config_version, estado, input/output validados, dependências |
| jobs | step_id, workspace_id, community_id, estado, lease_owner, lease_expires_at, attempts, next_run_at |
| approvals | workspace_id, community_id, recurso e versão, razão, decisão, decided_by, decided_at |
| artifacts | workspace_id, community_id, caminho, MIME, tamanho, origem, licença, hash |
| provider_accounts | workspace_id, provedor, external_account_ref, plano verificado, secret_ref, eligibility_checked_at |
| quota_buckets | provider_account_id, período UTC, unidade, teto, observado, consumido, reservado; único por conta/período |
| cost_limits | workspace_id, community_id opcional, provider_account_id opcional, dimensão, teto e margem |
| cost_reservations | bucket_id, workspace_id, community_id, step_id, quantidade máxima, estado e vencimento |
| usage_events | reserva, conta, modalidade, modelo, quantidade observada/estimada, request_ref, timestamps |
| metric_events | workspace_id, community_id, publicação, origem, tipo, valor, observed_at; proveniência obrigatória |
| audit_events | workspace_id, community_id opcional, ator, ação, alvo, resultado e correlation_id; sem segredos |

## Integridade e concorrência

- Chaves estrangeiras compostas devem impedir associar canal, conta, conteúdo ou oferta de comunidades/workspaces distintos.
- Valores monetários em unidades inteiras mínimas mais moeda; nunca float para preço. Quantidade de quota pode exigir precisão decimal de Neurons conforme tarifa oficial.
- Timestamps em UTC; fuso da comunidade somente para apresentação/agendamento.
- Índices por workspace/comunidade/estado e agenda; uniqueness para idempotência e fontes externas, com escopo adequado.
- Limites de tamanho e estrutura para JSON; payload bruto externo não vira configuração válida automaticamente.
- Reserva e claim de job são transações; bloqueio do bucket compartilhado evita duas modalidades reservarem saldo simultaneamente.
- Registros globais do catálogo de capacidades são separados de contas privadas. Logs de consumo de toda a conta não ficam acessíveis a operadores de uma comunidade.

## Isolamento planejado

RLS em todas as tabelas expostas antes de qualquer acesso do cliente. Grants mínimos e policies por associação validada; negar por padrão. Nenhuma escrita pública. Visitantes de landing pages terão somente projeção publicada e sanitizada, nunca tabelas administrativas completas.

Papéis propostos: administrador do workspace gerencia membros/configuração; operador atua nas comunidades atribuídas; leitor consulta recursos permitidos. Usuário não escolhe seu papel nem sua associação. Papel e associação são resolvidos em fonte autorizada, não em metadados alteráveis pelo usuário. Funções auxiliares não podem criar recursão de RLS. Auditoria/ledger recebem escrita apenas de execução confiável; a leitura continua limitada ao escopo autorizado.

Admin privilegiado, quando inevitável para infraestrutura, não substitui RLS em operações comuns. Toda autorização é verificada antes de qualquer bypass. Regras concretas e SQL ficam para revisão da fase de segurança, não estão implementados aqui.

## Storage, migração e retenção

Buckets privados por padrão; acesso autenticado ou URL assinada de curta duração. Divulgação pública exige artefato aprovado. Paths não são autorização. Retenção de artefatos/logs deve caber na franquia, com exportação antes de descarte e política LGPD aprovada. Não presumir backup gerenciado no plano gratuito.

Migrations futuras: identidade/associações → comunidades/configurações → workflow/custos → ofertas/conteúdo/publicação → métricas. Cada etapa inclui constraints, índices, grants, RLS e testes; dados piloto, se requeridos, entram explicitamente na migration autorizada. Não criar seed no carregamento da página.

Para tabelas públicas futuras, a ordem é criação → grants explícitos mínimos → habilitação de RLS → policies, na mesma migration. RLS sem grants não torna a tabela acessível pela API de dados. Papéis pertencem a tabelas de associação dedicadas, nunca ao perfil do usuário; funções de autorização devem evitar recursão e restringir escopo.