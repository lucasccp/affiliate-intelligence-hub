# Prompts rápidos do Codex

Use os dois prompts abaixo no Codex. Consulte o [manual mestre](docs/PROJECT_MASTER_GUIDE.md) e o [status](docs/PROJECT_STATUS.md).

## 1. Recuperar contexto — executar no Codex

```text
Leia AGENTS.md, docs/PROJECT_MASTER_GUIDE.md e docs/PROJECT_STATUS.md. Execute o prompt de recuperação de contexto e siga o roteamento obrigatório de execução do manual mestre.

Identifique a fase atual, funcionalidades reais, pendências, riscos e próxima fase. Informe explicitamente onde executar a próxima etapa: Codex, Lovable ou ambos, em qual ordem e por quê. Se houver bloqueio, indique como resolvê-lo e em qual ferramenta.

Forneça o prompt exato pronto para copiar na ferramenta indicada. Não altere nada. Aguarde minha autorização.
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

Checkpoint e recuperação de contexto: Codex. Revisão técnica após Lovable: Codex. Fases 0 e 1 são históricas (Lovable); não reexecutar sem autorização. Fase 2 e 6: Codex. Fases 3–5 e 7–15: híbridas, com Codex como ponto de entrada e Lovable somente quando necessário. Esta regra detalha a ordem das linhas Ferramenta, não altera os requisitos de produto.


