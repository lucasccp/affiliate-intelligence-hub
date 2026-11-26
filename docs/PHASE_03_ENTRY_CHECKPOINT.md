# Checkpoint de entrada da Fase 3

Data: 26/11/2026. **Parecer: BLOCKED.** Este checkpoint não inicia a Fase 3.

## Referências e integração proposta

| Branch | HEAD | Escopo |
| --- | --- | --- |
| main | `85ff565` | Fundação e consolidação documental V4.0 |
| docs/v4-phase-02-1-research | `71ecf83` | Reconciliação da Fase 2 e pesquisa 2.1 |
| phase-02/piloto-deterministico | `793bdab` | Migrations 0005–0006, tipos gerados, casos de banco, painel de Comunidades e Server Functions |

A simulação com `git merge-tree --name-only`, sem merge, retornou conflitos em `AGENTS.md` e `docs/PROJECT_STATUS.md`. Numa integração futura autorizada, preservar o prefixo Lovable e as regras V4.0, acrescentar a regra de mutações `pilot_*` do piloto e reconciliar as evidências por branch no status. Preservar migrations, metadados de migration e tipos do Lovable exatamente como entregues. A branch deste checkpoint deriva da pesquisa. main e piloto não foram modificados.

## Piloto e testes

Por inspeção do código, Comunidades mostra o painel para a comunidade selecionada, e as Server Functions usam autenticação e RPCs com autorização no banco. Cadastro e edição gravam revisão e texto do template. Aprovação recebe a versão exibida. Exportação consulta a revisão atual, aprovada e vigente no banco, com auditoria. A migration 0006 coordena a leitura com a atualização da revisão e preserva a concorrência das reservas de texto e imagem por conta simulada. Esse mecanismo ainda não é uma reserva de consumo real.

Em checkout isolado de `793bdab`, `bun install --frozen-lockfile`, `bun run build` e `bun x --no-install tsc --noEmit` passaram. `bun run lint` registrou zero erros e oito avisos existentes. `bun run test --exclude 'src/test/*.integration.test.ts'` passou com 15 testes em três arquivos. Nenhuma conta, banco remoto ou provedor foi acionado. O ambiente desta sessão não tinha confirmação da URL de desenvolvimento e das contas de teste autorizadas. Continuam pendentes a reprodução autenticada do fluxo e as suítes de isolamento, idempotência e concorrência em banco. O Lovable relatou 28 testes em ambiente anterior. [Checkpoint histórico do piloto](https://github.com/lucasccp/affiliate-intelligence-hub/blob/793bdab/docs/PHASE_02_VALIDATION.md)

## Transporte e custo adicional

- **Cloudflare Workers AI:** a REST API oficial usa token escopado por conta. Workers Free oferece 10.000 Neurons/dia, compartilhados entre texto e imagem, com reset 00:00 UTC e falha no excedente. Workers Paid cobra excedente. Modelos e conta real precisam ser elegíveis. Essa barreira controla o consumo de Workers AI no Free. As despesas de gateway, compute e backend seguem suas próprias regras. [REST](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) · [Preços](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- **Lovable:** a plataforma documenta HTTP direto em Server Functions e conectores REST customizados pelo gateway de conectores. O bloco gerenciado de AGENTS.md exige gateway Lovable para chamadas de modelos. O caminho HTTP direto não satisfaz essa regra. O conector customizado é candidato, mas a documentação geral não comprova que a rota Cloudflare atende à regra de modelos, quais modelos e formatos seriam aceitos nem como o workspace seria faturado. [Any API](https://docs.lovable.dev/integrations/any-api) · [Conector customizado](https://docs.lovable.dev/integrations/create-connector)
- **Créditos Lovable:** o gateway de IA consome franquia temporária em planos elegíveis e depois pode consumir créditos gerais. Conectores tarifados pela plataforma têm categoria própria de Run credits. O compute TanStack também pode consumir créditos acima dos limiares de hospedagem. A documentação atual descreve limites com bloqueio para escopo de projeto/workspace em planos pagos, inclusive AI e Connectors, e esclarece que contabiliza o uso antes de avaliar o bloqueio. O consumo pode ultrapassar o limiar. Isso atualiza o levantamento histórico de controles disponíveis, mas não comprova barreira exata nem a configuração da conta. Auto top-up desligado também não impede uso de saldo existente. [Lovable AI](https://docs.lovable.dev/features/ai) · [Créditos](https://docs.lovable.dev/introduction/credits-and-usage) · [Limites](https://docs.lovable.dev/features/usage-limits-and-alerts) · [Hospedagem](https://docs.lovable.dev/features/hosting)

O orçamento adicional permanece em R$ 0,00. Faltam evidência oficial específica da rota permitida e dados da conta sobre elegibilidade, todos os custos e bloqueio prévio. Enquanto isso, o fluxo determinístico é a opção disponível no piloto. Nenhuma mudança gerenciada específica foi autorizada ou aplicada.

## Handoff

### Lovable — consulta em modo de planejamento

> Leia AGENTS.md e o checkpoint desta branch. Em modo de planejamento, confirme com fonte oficial se o projeto pode chamar Cloudflare Workers AI Free através de um gateway Lovable que satisfaça a regra gerenciada para chamadas de modelos. Distinga gateway de IA e gateway de conectores. Informe compatibilidade com texto e imagem, autenticação server-side, faturamento e limites de Cloudflare, gateway, rede e compute. Identifique qual controle impede consumo faturável antes da chamada, inclusive concorrência, atraso de contabilização e esgotamento da franquia. Se a documentação ou a conta não permitirem concluir, liste as lacunas. Não modifique o projeto, não crie conectores, não faça chamadas de teste, não altere billing nem sincronize alterações.

### Codex — revisão após resposta e eventual sincronização autorizada

> Retome somente o checkpoint de entrada da Fase 3. Leia docs/PHASE_03_ENTRY_CHECKPOINT.md na branch docs/v4-phase-03-entry-checkpoint e a evidência oficial retornada pelo Lovable. Se houver commit gerenciado posterior e autorizado, revise o SHA e diff sincronizados, sem fazer merge. Reavalie transporte, custo adicional de R$ 0,00 e o bloqueio prévio de gasto. Valide em navegador apenas com URL de desenvolvimento e contas de teste explicitamente autorizadas. Preserve a reserva compartilhada entre texto e imagem e os controles do piloto. Atualize o parecer e PROJECT_STATUS.md em branch de trabalho. Aguarde nova autorização antes de implementar a Fase 3.

## Revisão da resposta do Lovable — 26/11/2026

**Inferência externa: BLOCKED.** O relatório retornou NÃO COMPROVADA. O Lovable informou workspace Free e recarga automática desligada. Nenhuma fonte citada confirma Workers AI pelo gateway de modelos, nem que o conector Cloudflare seja permitido para inferência e sem custo adicional em todas as camadas. A afirmação de que o endpoint seria encaminhado é hipótese técnica, sem chamada ou confirmação oficial específica. O bloqueio de excedente do Cloudflare Free cobre a inferência no provedor. Taxa do conector, comportamento com saldo zero e compute do projeto ainda precisam de comprovação. [Resposta do Lovable](https://github.com/lucasccp/affiliate-intelligence-hub/blob/fb05439e1394d91e9a1ee9f3035dfb1af3154a57/docs/PHASE_03_GATEWAY_FEASIBILITY.md)

A Fase 3 define o AI Core e o Cost Guardian com templates e importação manual. Sua eventual execução em escopo exclusivamente determinístico pode ser autorizada separadamente após revisão do gate e da validação autenticada do piloto. As Fases 4 e 5 continuam condicionadas à comprovação da rota e do custo de inferência. A próxima ação é Codex para delimitar esse escopo ou, se for prioridade liberar inferência, consulta ao suporte oficial do Lovable com a pergunta do relatório. A validação autenticada do piloto segue pendente. Nenhuma implementação foi iniciada.

## Aceite autenticado do piloto — 26/11/2026

O administrador confirmou que o roteiro no preview passou: cadastro, persistência e conferência do template, aprovação e exportação, nova aprovação após edição e bloqueio de exportação após vencimento. Evidência reportada pelo administrador, sem reprodução independente no Codex. O commit e a branch efetivamente carregados no preview não foram informados.

A validação autenticada reportada encerra a pendência funcional do roteiro. Inferência externa continua bloqueada. A Fase 3 assistida, com templates, importação manual e testes simulados, aguarda autorização explícita.
