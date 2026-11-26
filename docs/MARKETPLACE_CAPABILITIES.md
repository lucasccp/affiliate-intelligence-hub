# Capacidades de marketplaces

**Matriz de planejamento, não catálogo de integrações verificadas.** O briefing não identifica programas, país, contas ou marketplaces autorizados. Não há endpoints, logins, descoberta ou links reais nesta entrega.

## Matriz por capacidade

| Capacidade | Caminho preferencial futuro | Limitação / alternativa |
| --- | --- | --- |
| Descoberta de produtos | API/feed oficial gratuito e autorizado | Importação CSV/JSON manual validada |
| Descoberta de promoções | Feed/API oficial com preço e validade | Cadastro manual com fonte e horário |
| Histórico e desconto | Histórico oficial ou próprio com base comparável | Não afirmar desconto sem referência verificável |
| Sazonalidade | Calendário determinístico + dados permitidos | Hipótese separada de promoção confirmada |
| Link afiliado | Ferramenta/API oficial da conta habilitada | Importar link gerado pelo administrador |
| Imagem de produto | Material oficial permitido pelo programa | Upload licenciado; não copiar indiscriminadamente |
| Disponibilidade e frete | API oficial, escopo e região | Exibir desconhecido/condicional quando indisponível |
| Conversões/comissões | Relatório oficial com autorização | Importação manual com proveniência |
| Publicação/distribuição | Capability do canal, não do marketplace | Rascunho exportável e publicação humana |

Nenhuma linha da matriz é marcada como integrada. Amazon, Mercado Livre, Shopee ou outros programas, se escolhidos posteriormente, exigem análise própria; não afirmar acesso a API de afiliados com base no nome da empresa.

## Registro de avaliação por programa

Campos obrigatórios: programa/país, conta aprovada, documentação oficial, capacidade, método de acesso, uso comercial permitido, autenticação, escopos, preço/franquia, rate limits, restrições de conteúdo/imagens, exigências de divulgação, data e status. Verificar regras de encurtamento, redirecionamento e alteração de links em cada programa.

Status inicial `unverified`; pode mudar para `manual_only`, `blocked`, `eligible` ou `configured` com evidência. Scraping não é substituto automático de API: termos, proteção de dados e limites podem proibir. Não contratar scraping/proxy nem contornar bloqueios, CAPTCHA ou autenticação.

## Qualidade da oferta

Guardar identificador, título, categoria, origem, moeda, preço observado, histórico quando real, disponibilidade, validade, link e conta afiliada. Oferta vencida ou sem preço verificável não recebe publicação automática. Ranking determinístico combina regras configuráveis por comunidade; comissão não substitui relevância e veracidade. Não inserir regras automotivas na lógica genérica.

Links importados são rotulados como manuais e validados sintaticamente/por hosts permitidos, sem prometer comissão ou conversão. Resultado de venda vem somente de fonte oficial/importada identificada, nunca de clique presumido.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Piloto Brasil: Shopee, Mercado Livre, Amazon. Evidências de interface SenaFlow, não autorização: Shopee AppID/Secret, vendas mínimas anunciadas; Amazon tag e opção de cookies (proibida neste projeto); ML coleta manual/agendada anunciada, acesso técnico desconhecido. Guia concorrente declara desconto ML/Amazon e ocasional Shopee, vendas mínimas indisponíveis ML/Amazon, disponíveis Shopee/AliExpress; AliExpress/Shein/Kabum expansão posterior. Todas capacidades oficiais permanecem unverified até Fase 2/2.1. Separar busca, ranking, vendas, preço referência, comissão, cupom, link e distribuição; cada uma com evidência oficial por conta. Não tratar ausência como zero ou passar silenciosamente filtro obrigatório; UI mostra incompatibilidade e exige escolha explícita de revisão/ignorar quando permitido. Tag Amazon somente formato oficial validado; links manuais oficiais como fallback. Sem cookies ou endpoint privado.
