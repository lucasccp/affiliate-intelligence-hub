# Prompts rápidos — Affiliate Intelligence Hub V4.0

Use os prompts abaixo no Codex como ponto de entrada. Consulte o [manual mestre](docs/PROJECT_MASTER_GUIDE.md) e o [status](docs/PROJECT_STATUS.md).

## 1. Recuperar contexto — executar no Codex

```text
Atue como engenheiro de software sênior e arquiteto responsável pela continuidade do Affiliate Intelligence Hub V4.0.

Recupere todo o contexto diretamente do repositório, considerando a última consolidação documental e os benchmarks da DivulgaLinks Pro e da SenaFlow.

1. Leia AGENTS.md, README.md e os documentos em docs/: PROJECT_MASTER_GUIDE.md, PROJECT_STATUS.md, ROADMAP.md, ARCHITECTURE.md, PRD.md, DATABASE.md, COMPETITIVE_BENCHMARK.md, INTEGRATIONS.md, MARKETPLACE_CAPABILITIES.md, ZERO_COST_POLICY.md, SECURITY.md, AI_PROVIDERS.md e IMAGE_GENERATION.md.
2. Analise branch, commits recentes, código e alterações pendentes. Identifique última fase efetivamente implementada, funcionalidades reais, pendências, ressalvas dos checkpoints, divergências, riscos técnicos e financeiros e próxima fase.
3. Preserve arquitetura e funcionalidades existentes, aplique a consolidação V4.0, mantenha orçamento adicional R$ 0,00, respeite recursos gerenciados pelo Lovable e não habilite serviços pagos ou integrações não autorizadas. Não confunda planejamento com implementação.
4. Apresente objetivo, escopo, entregáveis, critérios de aceite e dependências da próxima fase. Informe ferramenta (Codex, Lovable ou ambos), ordem e motivo. Forneça prompts separados e prontos para copiar quando híbrida.
5. Não altere arquivos neste diagnóstico. Aguarde autorização explícita. Após cada fase autorizada, execute checkpoint, atualize PROJECT_STATUS.md, reporte testes e indique ferramenta e prompt exato da próxima etapa. Nunca avance automaticamente.
```

## 2. Autorizar a próxima fase — executar no Codex

```text
Autorizo a próxima fase identificada no diagnóstico, respeitando seus gates. Leia o prompt correspondente e as regras comuns e de roteamento em docs/PROJECT_MASTER_GUIDE.md.

Antes de implementar, informe a fase autorizada, a ferramenta correta e a sequência de execução. Se for Codex, execute somente o escopo autorizado. Se exigir Lovable, não altere recursos gerenciados: forneça o prompt específico para colar no Lovable, explique como sincronizar com GitHub e aguarde minha confirmação. Em fases híbridas, separe as tarefas e indique o próximo passo exato a cada transição.

Ao concluir, execute o checkpoint no Codex, atualize docs/PROJECT_STATUS.md e apresente resultados, pendências e parecer. Indique a próxima fase, ferramenta, ordem e prompt pronto para copiar, mas não avance sem nova autorização.
```

## Roteamento obrigatório de execução

O Codex é o ponto de entrada para diagnóstico, autorização, revisão e acompanhamento. A ferramenta de cada fase está indicada no respectivo título/linha Ferramenta. Nas fases híbridas, a ordem padrão é Codex (inspeção e plano técnico) → Lovable (somente alterações gerenciadas necessárias) → sincronização GitHub → Codex (implementação não gerenciada, testes e checkpoint). Se não houver alteração gerenciada, dispensar Lovable. Se houver dependência técnica diferente, explicar e indicar a ordem exata. Nunca editar migrations/arquivos gerados/secrets gerenciados nem contornar gateway. Não presumir acesso ao Lovable.

Em todo diagnóstico, autorização e checkpoint, informar: fase atual e status; próxima fase e gate; ferramenta de início (Codex ou Lovable); sequência de ferramentas e motivo; ação do usuário; prompt exato pronto para copiar na ferramenta indicada, limitado ao escopo autorizado. Se a próxima etapa exigir Lovable, parar antes da alteração gerenciada e fornecer prompt específico para o editor, com critérios de aceite e instrução de sincronização. Depois da sincronização, fornecer prompt de retomada no Codex. Não executar outra fase sem autorização. Se bloqueado, indicar ferramenta e prompt para resolver o bloqueio, sem habilitar serviços pagos.

Checkpoint e recuperação de contexto: Codex. Revisão técnica após Lovable: Codex. Fases 0 e 1 são históricas (Lovable); não reexecutar sem autorização. Fases 2, 2.1, 6 e 18: Codex. Fases 3–5, 7–10, 10.1, 11–17 e 19–20: híbridas, com Codex como ponto de entrada e Lovable somente quando necessário. Esta regra detalha a ordem das linhas Ferramenta, não altera os requisitos de produto.



## V4.0
Siga a ordem de ROADMAP.md (inclui 2.1 e 10.1). Leia COMPETITIVE_BENCHMARK.md para pesquisa e prints sanitizados. A consolidação SenaFlow de 26/11/2026 está nos 15 documentos de planejamento; aplicar os complementos do manual mestre, sem presumir integração oficial ou implementação. Páginas ponte são hipótese de aquisição. Fase 1 com ressalvas; gate financeiro pendente. Próxima fase registrada: 2, Codex; não presumir conclusão.

## 3. Retomar após Lovable — executar no Codex

```text
Sincronizei as alterações autorizadas do Lovable com GitHub. Leia AGENTS.md, PROJECT_MASTER_GUIDE.md e PROJECT_STATUS.md (os dois últimos em docs/). Confira branch, diff, recursos gerenciados e critérios da fase vigente. Execute apenas o trabalho não gerenciado restante e o checkpoint quando aplicável. Reporte testes, bloqueios e status; forneça ferramenta, ordem e prompt exato da próxima etapa. Não avance sem autorização.
```
