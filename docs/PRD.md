# PRD — Affiliate Intelligence Hub

Versão documental 0.1 · referência: briefing V3.0, Fase 0 · 25/11/2026 (UTC).

## Atualização da Fase 1

Briefing da fundação autorizou autenticação, perfil, workspace pessoal, dashboard real, comunidades e configurações. Esses módulos foram implementados com persistência e isolamento; módulos de IA/marketplace/publicação continuam indisponíveis. Critérios e evidências atuais estão em PROJECT_STATUS.md. As seções de escopo abaixo documentam a Fase 0, não limitam retroativamente a Fase 1 autorizada.

## Produto e usuários

Plataforma para um administrador criar e operar comunidades de ofertas afiliadas a partir de um nicho. Arquitetura multi-nicho desde a origem; automotivo será apenas o piloto. O administrador é o usuário inicial. Papéis adicionais são proposta de arquitetura, não requisito já implementado.

Cada comunidade possui nicho, marca, posicionamento, público, categorias, marketplaces, contas afiliadas, canais, estratégias, identidade visual, agenda, limites, regras de aprovação e indicadores independentes.

## Jornada desejada, ainda não implementada

1. Informar nicho e objetivos; validar entrada e criar comunidade em rascunho.
2. Analisar nicho e público, propor nome e posicionamento.
3. Preparar identidade, logotipo, imagens, materiais e landing page.
4. Preparar canais e contas de marketplaces; pedir autorização quando indispensável.
5. Descobrir produtos, promoções e sazonalidade usando fontes permitidas.
6. Classificar ofertas, gerar ou importar links afiliados verificáveis.
7. Produzir conteúdo, submeter aprovações necessárias e agendar.
8. Publicar somente em canais autorizados; registrar resultado real.
9. Monitorar indicadores disponíveis e otimizar sem ultrapassar limites.

Supervisor coordena etapas; serviços especializados executam tarefas. Não há promessa de acesso automático a capacidades não oferecidas oficialmente.

## Requisitos

| ID | Requisito | Verificação futura |
| --- | --- | --- |
| R01 | Separação de configurações e dados por comunidade | Duas comunidades de nichos distintos sem vazamento |
| R02 | Controle financeiro obrigatório e compartilhado por conta | Texto e imagem disputam a mesma franquia |
| R03 | Intervenção apenas por autorização, configuração, aprovação ou limitação técnica | Toda espera registra motivo e ação humana necessária |
| R04 | Agentes como serviços e workflows tipados | Etapas retomáveis e contratos validados |
| R05 | Contingência comprovadamente gratuita ou pausa | Provedor pago nunca invocado |
| R06 | Conteúdo e links rastreáveis | Fonte, horário, aprovação e proveniência preservados |
| R07 | Resultado real distinto de rascunho/manual | Publicação exige confirmação externa ou evidência manual identificada |
| R08 | Código determinístico antes de IA | Classificação numérica, deduplicação e limites sem inferência desnecessária |

## Escopo desta fase

Documentar produto, decisões técnicas, dados conceituais, agentes, workflows, custos, segurança, capacidade de integração, roadmap, riscos e aceite. Inspecionar a base e consultar documentação pública oficial sem chamadas de inferência.

**Fora do escopo:** interface do produto, autenticação, migrations executáveis, RLS aplicada, banco provisionado, APIs, geração de imagens/textos, conectores, bots, scraping, publicação, cron e worker local. Contratos em documentos são propostas, não código operacional ou mocks conectados.

## Critérios de aceite da Fase 0

- Todos os arquivos solicitados existem e se referenciam corretamente.
- Arquitetura contém os 14 agentes, fronteiras, estados, retomada e isolamento multi-nicho.
- Política de R$ 0,00 impede contratação, billing, créditos, APIs pagas e fallback pago.
- Texto e imagem compartilham franquia Cloudflare por conta, com reserva e reconciliação planejadas.
- Provedores têm estado de elegibilidade explícito e fontes; assinatura ChatGPT não é tratada como chave gratuita.
- Divergências de stack e limitações de hospedagem estão explícitas, sem ativação de serviço.
- Modelo de dados, segurança e testes futuros não são apresentados como implementados.
- Status inclui evidências das verificações e riscos; nada avança automaticamente.

## Indicadores futuros

Ofertas válidas, taxa de aprovação, tempo de descoberta a publicação, falhas por canal, cliques com fonte conhecida, conversões e comissões quando fornecidas oficialmente. Consumo em Neurons e reservas são indicadores operacionais; valores não são receita. Dados ausentes permanecem desconhecidos, não viram zero nem conversão estimada apresentada como real.

## Ampliação V4.0 — 26/11/2026
Requisitos futuros aprovados para planejamento, não implementação: R09 descoberta independente de geração de links, ranking e fonte; R10 cupons com elegibilidade/validade/preço efetivo; R11 extensão assistida autorizada, importação individual/lote e revisão; R12 links por campanha/canal e redirecionamento somente permitido; R13 vitrine pesquisável e expiração; R14 múltiplos destinos, saúde de conexão, comentário→DM oficial; R15 fila operacional com regras, preview e limites; R16 vídeo local, PWA, novos marketplaces, WordPress e colaboração opcional. Aceite e ordem no PROJECT_MASTER_GUIDE.md e ROADMAP.md. Benchmark não comprova APIs ou permissões. Custo adicional zero e multi-nicho permanecem obrigatórios.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Requisitos adicionais planejados: grupos de disparo por comunidade com múltiplos destinos, regras versionadas, limites e horários, modo assistido padrão, coleta manual/agendada usando mesma configuração; guia de filtros por marketplace com compatibilidade e dados ausentes explícitos. Produção revisa e reordena fila, negativas, exclusão em lote confirmada; Produtos oferece grid/lista, busca, filtros e contadores reais. Convite automático opcional em destinos autorizados com {link}, imagem reutilizada, agenda e pausa. Páginas ponte como landing pages de aquisição com CTA e métricas agregadas (hipótese, não função premium confirmada). Extensão de captura assistida e conexão por credencial oficial, nunca cookies. Não prometer automação WhatsApp não autorizada.
