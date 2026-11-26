# Checkpoint da Fase 2

Revisão em 26/11/2026. Base publicada: `main` em `0208fca`. Descoberta em `c33e3f7` e piloto em `a26e779`, ambos em branches de trabalho. A Fase 1 foi aceita pelo administrador. O prompt de descoberta da Fase 2 e o prompt de AI Core e Cost Guardian da Fase 3 foram confrontados com o estado publicado, junto das regras comuns e do checkpoint do guia mestre.

## Parecer

**BLOCKED para iniciar a Fase 3.** A autorização foi recebida. A descoberta da Fase 2 está documentada e o piloto determinístico foi preparado parcialmente. O aceite do piloto requer persistência, interface e testes de segurança e transações. O transporte oficial e a elegibilidade financeira para inferência também permanecem pendentes. A revisão não ativou APIs, faturamento ou serviços externos.

| Critério | Evidência |
| --- | --- |
| Descoberta da Fase 2 | Checkpoint da fundação, análise de custos e matriz de capacidades publicados na [branch de viabilidade](https://github.com/lucasccp/affiliate-intelligence-hub/tree/docs/phase-02-feasibility/docs). O parecer de entrada para Fase 3 já era BLOCKED. |
| Template, aprovação e exportação | Regras de domínio locais verificadas para fonte, preço, validade e versão. Ainda sem CRUD, registro da decisão ou exportação por interface autenticada. |
| Franquia e custo | Regra local rejeita custo adicional ou desconhecido e snapshot expirado. Testes atualizam o snapshot em memória para simular consumo compartilhado. Falta reserva transacional com concorrência real, reconciliação e retenção de consumo incerto. |
| Workflow e recuperação | Persistência, claim, leases, retry, cache e idempotência ainda sem implementação. |
| Segurança e interface | A fundação autenticada continua com as migrations 0000–0004 e os controles históricos de RLS e FKs. O diff do piloto não introduz rotas, RPCs, cliente privilegiado, APIs externas, segredos ou migrations. Validação de RLS e acessibilidade do piloto depende da interface e do banco. |
| Prompt da Fase 3 | Registry, provedores, filas, reservas, AI Center e operação ponta a ponta não estão disponíveis. O piloto local não demonstra nenhum desses critérios de aceite. |

## Verificações reproduzidas

Executadas em checkout limpo de `a26e779` com Bun 1.4.5.

| Comando | Resultado |
| --- | --- |
| `bun install --frozen-lockfile` | Sucesso, 547 pacotes instalados. |
| `bun run lint` | Sucesso, 0 erros e 8 avisos existentes de Fast Refresh. |
| `bun run test --exclude src/test/hub-rls.integration.test.ts` | 15 aprovados, incluindo os seis casos do piloto. |
| `bun run build` | Sucesso, com avisos das ferramentas sobre aliases e validação TanStack deprecada. |
| `bun x --no-install tsc --noEmit` | Sucesso. |
| Banco real e browser | Suíte com criação de contas excluída por ausência de ambiente de integração aprovado. Fluxos ponta a ponta de autenticação e do piloto não revalidados. |

## Dependência

O bloco gerenciado de AGENTS.md reserva ao Lovable as migrations e os tipos gerados. O conector do Lovable está indisponível nesta sessão. A definição para o editor está em [Solicitação ao Lovable](PHASE_02_PILOT.md#solicitação-ao-lovable). Após a entrega gerenciada, deve-se conectar o fluxo e validar isolamento, aprovação por revisão, retomada e concorrência em ambiente autorizado. Para inferência real continua necessário comprovar transporte permitido e custo adicional zero. O teto de R$ 50 discutido anteriormente permanece uma possibilidade futura.

## Parte gerenciada aplicada (Lovable)

Migration `0005_phase2_pilot_offers_workflow_quota.sql` aplicada no banco único do projeto com autorização explícita do administrador (app não publicado). Tabelas `pilot_*` têm somente SELECT para membros. Mutações ocorrem apenas por funções transacionais que verificam o papel de gestão: `pilot_save_offer`, `pilot_approve_offer`, `pilot_export_offer`, `pilot_enqueue_job`, `pilot_claim_job`, `pilot_complete_job` e `pilot_reserve_quota`. `pilot_record_quota_snapshot` e `pilot_settle_reservation` são exclusivas do servidor. Revisões, eventos e artefatos não aceitam edição. O provedor está restrito a `simulated`. Os testes de `src/test/pilot-db.integration.test.ts` foram aprovados com contas isoladas e removidas. Interface e Server Functions não foram alterados.

## Revisão Codex após sincronização Lovable

Base revisada: `3598c8e` na branch `phase-02/piloto-deterministico`. A migration 0005 e os tipos correspondentes estão no GitHub. **Aceite operacional da Fase 2: BLOCKED.**

- A migration declara RLS para os oito objetos de dados do piloto, leitura por membro, RPCs de mutação com autorização de gestor, funções de snapshot/liquidação restritas a service role e FKs compostas nas relações principais. A autoria das operações humanas usa `auth.uid()`. A reserva de texto/imagem trava a mesma conta simulada antes de conferir saldo.
- `pilot_complete_job` cria `text_export` sem assegurar que a revisão do job ainda é a atual, está aprovada e está vigente. A suíte entregue verifica criação do artefato sem registrar aprovação antes do job. A interface depende de uma correção transacional gerenciada. A exportação direta também precisa coordenar a leitura da revisão com edições concorrentes.
- `pilot_reserve_quota` retorna uma reserva existente antes de validar a política monetária e sem conferir que o retry representa a mesma comunidade, modalidade e quantidade. A regra de idempotência deve distinguir repetição exata de conflito.
- Validade e lease usam `now()`, que fica fixo desde o início da transação. Em operações que aguardam lock, revalidar com o relógio corrente do banco após obter o lock. Testar em ambiente autorizado, incluindo revisão alterada ou expirada antes da conclusão e colisão de chave de reserva.
- O checkpoint local passou em instalação congelada, build, TypeScript e 15 testes. O lint inicialmente encontrou um erro de formatação na suíte de banco. Correção exclusiva de formatação aplicada, com lint final de zero erros e oito avisos existentes. As duas suítes de banco foram excluídas desta execução. A aprovação anterior relatada pelo Lovable não foi reproduzida nesta sessão.

Próxima ação: Lovable deve entregar migration incremental e tipos se o contrato mudar. Depois da sincronização, Codex revisa o diff, valida o banco em ambiente autorizado e conecta a interface. Sem alteração de faturamento, serviço externo ou avanço à Fase 3.
