# Checkpoint da Fase 2.1 — Marketplace Integration Research

Revisão de 26/11/2026. Branch documental baseada na main V4.0 em `85ff565`. A Fase 1 está implementada na main e foi aceita pelo administrador. A [descoberta da Fase 2](https://github.com/lucasccp/affiliate-intelligence-hub/tree/c33e3f7/docs) está publicada em branch própria. O [piloto determinístico](https://github.com/lucasccp/affiliate-intelligence-hub/commit/793bdabf59b10644ba87d8ffc08c069464ce4246) está em outra branch, com migrations 0005–0006 do Lovable e tela em Comunidades. Nenhum desses commits foi incorporado à main nesta etapa.

## Evidências e aceite

| Critério | Resultado |
| --- | --- |
| Fase 2 reconciliada | main com fundação e V4 documental. Descoberta, piloto, testes e limitações vinculados no status. A pesquisa pública 2.1 pode avançar independentemente da validação autenticada do piloto. |
| Evidência competitiva | Publicidade e listagem pública da DivulgaLinks revisitadas. SenaFlow avaliada pelos relatos e prints sanitizados já descritos no benchmark. Sessões e credenciais ficaram fora da pesquisa. [Benchmark](COMPETITIVE_BENCHMARK.md) |
| Matriz oficial Brasil | Busca, ranking, vendas, preço, desconto, cupons, comissão, link, retenção e distribuição classificados por marketplace. [Matriz](MARKETPLACE_CAPABILITIES.md) |
| Contratos e POC | Plano de prova de conceito local com dados sintéticos e extensão assistida futura, sem implementação ou publicação. [Integrações](INTEGRATIONS.md) |
| Custo e autorização | Pesquisa pública com R$ 0,00 de gasto adicional. Custo operacional e acesso das contas continuam não comprovados. Nenhuma integração ativada. |
| Verificação desta entrega | Conferência dos heads e escopo do diff, verificação de espaços em branco e referências locais dos documentos alterados. Suítes de aplicação e de banco não foram executadas, pois a entrega altera somente documentação. |

## Checkpoints anteriores

No piloto `793bdab`, o Codex registrou 15 testes locais aprovados, lint com zero erros e oito avisos, build e TypeScript aprovados. O Lovable relatou 28 testes com contas isoladas e removidas, incluindo concorrência e retomada. O Codex não reproduziu esses testes de banco. A validação em navegador autenticado e a decisão de incorporar o piloto à main ainda estão pendentes. [Relatório do piloto](https://github.com/lucasccp/affiliate-intelligence-hub/blob/793bdab/docs/PHASE_02_VALIDATION.md)

## Parecer

**Pesquisa 2.1: APPROVED_WITH_WARNINGS.** Matriz e plano entregues. Faltam as telas autenticadas sanitizadas do trial DivulgaLinks, o contrato brasileiro completo da Shopee Open API e as verificações de conta, termos de reutilização e custo para ativação. Pesquisa não equivale à habilitação comercial.

**Próxima ação: Codex, checkpoint de entrada. Fase 3: BLOCKED no estado revisado.** Validar o piloto em ambiente de desenvolvimento autorizado, decidir a integração das branches e comprovar transporte oficial e elegibilidade financeira. Quando liberada por autorização explícita, a fase híbrida começa no Codex, passa pelo Lovable apenas para alterações gerenciadas, sincroniza no GitHub e volta ao Codex para implementação e checkpoint.
