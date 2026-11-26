# Benchmark competitivo — DivulgaLinks Pro
Data: 26/11/2026. Referência https://pro.divulgalinks.com.br/ e https://chromewebstore.google.com/detail/divulgalinks-captura-de-o/mkcedooeompagkmpkfcedpjhdbejhick . Hipóteses do levantamento anterior, ainda não revalidadas nesta revisão. Usuário informou ter iniciado trial de 14 dias; nenhuma tela autenticada recebida. Não tratar marketing como prova de backend ou autorização de API.

## Objetivo
Comparar fluxos, campos, filtros e capacidades, sem copiar código, identidade visual, dados privados ou contornar autenticação. Separar evidência observada, declaração comercial, hipótese e confirmação oficial. Registrar fonte, data, evidência sanitizada, restrições, custo, dependências e fase. Não guardar prints privados no repositório público.

## Prioridades
P0: busca por palavra-chave/URL, best sellers, preço, comissão, cupons, captura individual/lote autorizada, links oficiais/importados, filas e aprovação. P1: vitrines, múltiplos destinos, monitoramento de conexões, tracking permitido, comentário para DM oficial, templates. P2: vídeo programático, PWA, expansão de marketplaces, WordPress, colaboração.
Shopee: Affiliate API é hipótese prioritária a validar oficialmente, aprovação e credenciais necessárias. Mercado Livre: extensão concorrente anuncia captura e conversão; mecanismo interno de link desconhecido. Não exportar cookies, tokens ou sessões, não chamar endpoints privados; captura assistida somente se termos permitirem, importar link gerado oficialmente. Amazon: Creators API e tag são candidatos; validar formatos, elegibilidade, canais e retenção. Descoberta, enriquecimento e link são capacidades independentes. Não presumir acesso a rankings ou comissões.

## Checklist de evidências do trial (enviar ao chat, não ao GitHub)
1. Dashboard com menu completo e submenu marketplaces.
2. Configuração de Mercado Livre, Shopee e Amazon: tela antes de conectar, campos e instruções, sem valores de credenciais.
3. Busca por palavra-chave automotiva (ex.: suporte celular carro): filtros, resultados, ordenação, detalhe de um produto; repetir por URL.
4. Best sellers: seleção marketplace/categoria, ranking, período, filtros e detalhe.
5. Gerador de links: entrada URL pública, marketplace selecionado, opções, resultado com identificadores pessoais ocultos; fluxo individual e lote; erro se conta não conectada.
6. Cupons: lista, filtros, detalhe, validade, regras, preço antes/depois.
7. Extensão Chrome: tela de instalação/permissões, popup/side panel, captura de produto e listagem, preview, seleção destino, resultado importado. Não enviar DevTools com headers, HAR, cookies, storage, QR ou tokens.
8. Canais: configuração WhatsApp/Telegram/Instagram sem QR, números, IDs privados ou tokens; múltiplos destinos, regras, status, comentário/DM.
9. Automação: criar regra em rascunho, filtros, agenda, fila, limites, dedupe, preview, logs; não disparar mensagens reais.
10. Templates, criativos, vídeo, vitrine, analytics, equipe: telas de configuração e preview, sem dados pessoais.
Priorizar 1–7. Capturar sequência antes/depois da ação, URL sem parâmetros sensíveis, mensagem de erro e campos visíveis. Não conectar conta ou publicar só para produzir evidência. Se trial limitar, registrar bloqueio. Nunca enviar senhas, chaves, cookies, tokens, QR de login, dados de clientes ou identificadores afiliados completos.

## Entregáveis da pesquisa
Matriz por marketplace/capacidade e origem, mapa de fluxos, lacunas e critérios de aceite, proposta de POC local sem chamadas externas não autorizadas. Pesquisa não autoriza implementação nem altera política financeira.

## Consolidação V4.0 — SenaFlow (26/11/2026)

### Evidência adicional: SenaFlow, distinta de DivulgaLinks Pro
Prints fornecidos pelo usuário: /grupos mostra grupos de disparo, destinos, marketplaces, modo automático, desconto mínimo, progresso diário, próxima coleta ML, Puxar Produtos e Disparar agora. Usuário confirma que Puxar Produtos usa configurações de Editar grupo. Guia de Filtros declara vendas mínimas Shopee/AliExpress, desconto disponível ML/Amazon/AliExpress/Shein/Kabum e ocasional Shopee, keywords obrigatórias por título (OR) e palavras proibidas. São declarações da interface, não confirmação oficial. /produtos mostra fila total/pendentes/enviados hoje, filtros por grupo/status, busca, grid/lista e limpeza. /producao mostra revisão por grupo, embaralhar, negativas e exclusão em lote. /convite-automatico mostra seleção de destinos, mensagem com placeholder {link}, imagem opcional JPG/PNG/WebP até 5 MB, agenda por hora e intervalo entre grupos; /canais mostra pareamento WhatsApp QR/código, instância e conexão bot Telegram. Pareamento e alertas de banimento não comprovam API oficial; não reproduzir sessões ou evasão. /extensao anuncia captura assistida Amazon/ML/Shopee e seleção de grupos; /marketplaces mostra Shopee AppID/Secret e Amazon tag com cookies SiteStripe opcionais. Não coletar cookies; verificar tag e API oficiais. Páginas ponte premium: hipótese do usuário de landing pages de aquisição, não observadas. Nenhuma validação de backend, credenciais ou publicação real. Não armazenar prints/IDs privados.

## Comparação da Fase 2.1 — 26/11/2026

| Fluxo | DivulgaLinks Pro | SenaFlow | Consequência para o Hub |
| --- | --- | --- | --- |
| Descoberta e importação | Listagem pública declara captura individual/em lote de páginas e listas do Mercado Livre, com Amazon e Shopee anunciadas para depois. Busca, rankings, cupons e permissões efetivas no trial seguem pendentes. | Prints descritos mostram Puxar Produtos, agenda e seleção de grupo. Uso da configuração atual foi relatado pelo usuário. | Separar curadoria, captura explícita e agendamento. Em fase futura, coleta manual e agendada usam a mesma versão de configuração. |
| Filtros e revisão | Campos, ordenação e comportamento sob dados faltantes ainda sem captura autenticada. | Guia declara filtros por marketplace. Produtos e Produção mostram fila, busca, estados, reordenação, negativas e exclusão. | Contadores reais por grupo/destino, filtros determinísticos e revisão quando faltar dado obrigatório. |
| Link e distribuição | Loja anuncia geração e encurtamento de links ML. Fluxo interno, permissões e atribuição não verificados. | Prints mostram candidatos de credenciais e canais. Convites usam destino e placeholder. A extensão anunciada seleciona grupos. | Importar link oficial quando autorizado. Captura termina em rascunho, publicação passa por aprovação e por permissões do canal. |
| Aquisição | Evidência autenticada ausente. | Páginas ponte são hipótese do usuário. | Tratar como hipótese da fase de landing pages, sem compra de produto premium. |

Fontes revisitadas da DivulgaLinks são declarações públicas do fornecedor. Evidência SenaFlow vem do inventário de prints e do relato documentado acima, com contexto autenticado fora desta pesquisa. Nenhuma evidência de interface confirma acesso oficial a endpoints, quotas, retenção ou autorização comercial. Faltam capturas sanitizadas do trial DivulgaLinks e confirmação oficial de uso por conta. [Chrome Web Store](https://chromewebstore.google.com/detail/divulgalinks-captura-de-o/mkcedooeompagkmpkfcedpjhdbejhick) · [Privacidade divulgada](https://pro.divulgalinks.com.br/extension/privacy) · [Matriz oficial](MARKETPLACE_CAPABILITIES.md)
