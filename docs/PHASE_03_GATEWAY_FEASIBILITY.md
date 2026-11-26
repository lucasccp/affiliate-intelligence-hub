# Fase 3 — Consulta de viabilidade de gateway (Cloudflare Workers AI)

Data: 26/11/2026 (UTC). Consulta somente leitura, em modo de planejamento. Nenhum código, banco, branch, segredo, faturamento ou conector foi alterado. Nenhuma chamada de teste foi feita. A Fase 3 não foi iniciada.

Referências: bloco gerenciado do `AGENTS.md` (regras "AI gateway" e "Connectors") e o [checkpoint de entrada `d51efe2`](https://github.com/lucasccp/affiliate-intelligence-hub/blob/d51efe2/docs/PHASE_03_ENTRY_CHECKPOINT.md).

## 1. Existe um caminho oficial que respeita a regra de gateway?

- **Gateway de IA do Lovable:** atende somente os modelos que a própria Lovable oferece (OpenAI, Google e Anthropic). A Cloudflare Workers AI não está entre eles, então esse gateway não cobre a rota.
- **Gateway de conectores:** existe o conector nativo `cloudflare`, que repassa a API v4 da Cloudflare sem filtrar endpoints. Tecnicamente, `POST /client/v4/accounts/{id}/ai/run/{model}` passaria por ele. A documentação do conector, porém, descreve apenas DNS, cache, WAF, Workers, R2, KV e analytics. Ela não cita Workers AI e não autoriza usar o conector para inferência.
- **Conector REST customizado:** a Lovable o indica para serviços sem conector nativo. Como a Cloudflare já tem um, ele não seria o caminho normal. Também não há fonte oficial que o permita para chamadas de modelos.
- **Leitura do AGENTS.md:** a regra "Keep model calls on Lovable's gateway" se refere ao gateway de IA. Usar o conector cumpre a regra de conectores, não a de modelos. HTTP direto da Server Function para `api.cloudflare.com` não cumpre nenhuma das duas.

**Conclusão:** nenhuma fonte oficial confirma uma rota permitida.

## 2. Quem pagaria em cada camada

| Camada | Quem paga | Confirmado | Pendente |
| --- | --- | --- | --- |
| Cloudflare Workers AI | Conta dona do token | Workers Free: 10.000 Neurons por dia, compartilhados entre texto e imagem, com reset às 00:00 UTC e recusa ao exceder. Workers Paid cobra o excedente. | Plano real da conta. Disponibilidade gratuita de cada modelo. |
| Conector Lovable | Créditos do workspace (categoria Connectors/Run) | Conectores tarifados consomem créditos de execução. | Se o conector `cloudflare` é tarifado por chamada. O que acontece com saldo zero. |
| Server Functions e backend | Franquia de Cloud do workspace | 20 créditos de Cloud por mês. Ao esgotar, o projeto é pausado. | Consumo real do projeto. |
| Gateway de IA Lovable | 4 créditos de IA por mês | Não se aplica: não oferece Cloudflare. | — |

**Workspace, lido em 26/11/2026:**
- Plano **Free**; a assinatura paga foi cancelada em 14/07/2026.
- Nenhum limite de crédito configurado. A tela de limites e alertas não existe no Free.
- Recarga automática desligada e nunca configurada.
- No Free não há créditos gerais nem compra de créditos.

## 3. Controles antes de enviar a chamada

- **Bloqueio do provedor (Cloudflare Free):** recusa o que passa da franquia, mas isso acontece no provedor, não antes do envio.
- **Limites Lovable (AI/Connectors):** a documentação diz que o uso é contabilizado antes de o bloqueio ser avaliado, então o consumo pode passar do limite. Não é um bloqueio prévio. Além disso, essa tela não existe no Free.
- **Alertas:** apenas avisam.
- **Pausa do Cloud:** age ao esgotar a franquia; é um teto por pausa, não um bloqueio por chamada.
- **Aplicação (migration 0006):** reserva simulada com trava por conta e um único saldo para texto e imagem. Ela não lê o consumo real da Cloudflare.

**Lacunas abertas:**
- Medição atrasada.
- Uso feito fora do Hub na mesma conta Cloudflare.
- Chamadas concorrentes reais. A proposta é limitar a uma inferência por conta e pausar quando o contador estiver desatualizado.

**Conclusão:** nenhum controle oficial bloqueia o gasto antes da chamada nas camadas Lovable.

## 4. Classificação: NÃO COMPROVADA

O plano Free, sem recarga, reduz o risco de cobrança em dinheiro na Lovable, mas não comprova a rota.

### Pendências

1. Fonte oficial dizendo se usar Workers AI pelo conector `cloudflare` atende à regra de modelos do AGENTS.md.
2. Como o conector `cloudflare` é cobrado e o que acontece com saldo zero.
3. Plano Workers da conta Cloudflare e modelos de texto e imagem disponíveis gratuitamente.
4. Existência de um bloqueio prévio, sem ultrapassagem, para Connectors e para o processamento das Server Functions.

### Pergunta para o suporte Lovable

> Em um projeto TanStack Start no plano Free, chamar `POST /client/v4/accounts/{id}/ai/run/{model}` da Cloudflare Workers AI pelo conector nativo `cloudflare` (connector gateway) é um uso permitido para inferência de modelos? Cada chamada consome créditos Lovable (Connectors/Run ou Cloud)? Sem créditos gerais, uma chamada de conector tarifado é recusada antes de executar ou gera saldo negativo? Existe algum limite que recuse a chamada antes de executá-la, sem ultrapassar o teto, para Connectors e para o processamento das Server Functions?

## Fontes oficiais

- [Cloudflare Workers AI — Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Cloudflare Workers AI — REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)
- [Lovable AI](https://docs.lovable.dev/features/ai)
- [Lovable — Conector customizado](https://docs.lovable.dev/integrations/create-connector)
- [Lovable — Any API](https://docs.lovable.dev/integrations/any-api)
- [Lovable — Limites e alertas](https://docs.lovable.dev/features/usage-limits-and-alerts)
- [Lovable — Créditos e uso](https://docs.lovable.dev/introduction/credits-and-usage)
