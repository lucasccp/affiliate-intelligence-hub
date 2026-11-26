# Integrações — estado por fase

Na Fase 0, somente documentação pública foi consultada. Na Fase 1, Lovable Cloud foi conectado para Auth/PostgreSQL e login por e-mail/senha, Google e Lovable foi habilitado. Marketplaces, canais e IA continuam sem conexões reais. OAuth social está configurado, mas roundtrip externo de Google/Lovable não foi testado.

## Registro obrigatório de capacidades

Cada adaptador futuro mantém: provedor, capacidade, fonte oficial, data de verificação, plano/conta, escopos, rate limits, unidade de consumo, requisitos de aprovação e status (`unverified`, `blocked`, `manual_only`, `eligible`, `configured`). Existência de API não significa acesso para a conta do administrador.

Não registrar endpoint presumido. Endpoint, SDK, licença, autenticação e formato só entram no código após confirmação na documentação oficial da capacidade específica.

| Integração planejada | Gate / estado atual |
| --- | --- |
| PostgreSQL, auth e storage | Lovable Cloud conectado na Fase 1; nenhuma garantia de equivalência ao plano externo Free; limite Cloud não certificado |
| Cloudflare Workers AI | Catálogo/preços públicos consultados; plano real, acesso, transporte e quotas da conta não validados |
| ChatGPT/Codex | Assinatura informada; elegibilidade oficial não confirmada; nenhum login ou API automatizados |
| GitHub | Não verificar/vincular conta por suposição; repositório da plataforma não comprova integração de automação |
| Ollama / ComfyUI | Opcional, hardware existente; não configurados e não presumidos acessíveis pela hospedagem |
| Marketplaces | Somente desenho de capacidades; nenhum programa/conta identificado como habilitado |
| Canais | Provedores e contas ainda não definidos; publicação automática não validada |

## Processo futuro

1. Administrador autoriza a fase e confirma conta/programa.
2. Verificar docs oficiais, uso comercial, custo, escopos e disponibilidade regional.
3. Bloquear qualquer capacidade que demande cobrança ou recurso obrigatório pago.
4. Configurar segredo por mecanismo seguro, nunca pelo código/chat.
5. Testar capacidade com limite estrito em fase autorizada; registrar resultado real.
6. Habilitar por comunidade somente capacidades aprovadas; configurar revogação e reconciliação.

Falha de elegibilidade resulta em checklist/manual ou pausa. Não contratar proxies, scraping, serviços de contorno ou alternativa paga.

## Canais e callbacks

Planejar por capacidade: preparação manual, autorização OAuth quando oficial, rascunho exportável, agendamento interno e publicação confirmada. Não assumir que criação automática de grupos/comunidades, leitura de membros ou publicação existe em toda rede.

Webhooks futuros usam fronteira de servidor com assinatura oficial e proteção replay; tarefas longas tornam-se jobs persistidos. O prefixo público da plataforma não garante autenticação por si só. Worker local recebe somente tarefas autorizadas em conexão segura iniciada pelo próprio worker; não expor serviço de inferência local sem autenticação na internet.

## V4.0 — pesquisa por capacidade
Fase 2.1 valida Shopee Affiliate API, ML afiliados/developers e Amazon Creators API/links oficiais independentemente para busca, ranking, preço, cupom, comissão, geração de link, retenção e distribuição. Todos permanecem não verificados para a conta. Extensão concorrente é pista funcional, não autorização; extensão própria somente captura assistida permitida e importação de link oficial, sem exportar sessão/cookies ou endpoints privados. Instagram comentário→DM somente oficial e consentido; WhatsApp manual/oficial elegível; redirecionamento afiliado somente se permitido. WordPress e novas redes em fases futuras. Ver COMPETITIVE_BENCHMARK.md.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Interfaces SenaFlow indicam Shopee AppID/Secret, Amazon tag e cookies opcionais, WhatsApp QR/código e Telegram bot. Somente AppID/Secret, tag e bot entram como candidatos após verificação oficial de capacidade/conta/custo. Não importar cookies ou parear sessão WhatsApp não oficial. ML coleta anunciada não comprova endpoint. Guia de Filtros usa registry oficial e estados de compatibilidade por capacidade. Fase 2.1 registra evidência e alternativa manual.

## Contratos propostos — Fase 2.1

Os contratos abaixo delimitam a futura prova local. Cada chamada recebe contexto validado de workspace, comunidade, marketplace BR e capacidade autorizada. O registro de capacidades vincula conta, finalidade, mídia/destino, fonte, data da verificação, escopos, custo, quota e retenção. Credenciais entram por referência opaca no servidor em fase autorizada.

| Contrato | Entrada → saída |
| --- | --- |
| `DiscoveryProvider.discover` | Consulta por termo, URL pública ou ranking com período quando suportado → candidatos paginados com identidade e proveniência. Ranking e vendas têm campos distintos. |
| `ProductProvider.lookup` | Identificador oficial e variante → observação de preço em centavos/BRL, disponibilidade, desconto verificável e evidência, com instante, validade e licença. |
| `AffiliateLinkProvider.resolve` | Produto e destino autorizado, mais conta elegível ou link oficial já gerado → URL de origem oficial/importada com finalidade e proveniência. Sem geração presumida, reescrita de tag ou encurtamento obrigatório. |
| `CouponProvider.lookup` | Produto/campanha com escopo permitido → cupom, termos, elegibilidade, origem e expiração. Capacidade opcional independente. |

Saídas versionadas distinguem sucesso, revisão humana, indisponibilidade, limite e bloqueio financeiro. Campos ausentes incluem motivo e permanecem nulos. Identidade estável para dedupe inclui marketplace, produto, variante e workspace/comunidade. Aprovação se vincula à versão da oferta e ao destino. Caminho manual usa dados e links de origem autorizada, mantendo a mesma validação.

### POC local proposta

Usar fixtures JSON sintéticas e relógio fixo, sem credenciais, HTTP, dependência paga, migration ou execução agendada. Simular busca que retorna itens repetidos, preço de outra variante, desconto sem referência, comissão ausente, categoria com ranking sem vendas, cupom vencido e URL oficial sintética. Exercitar: normalização e dedupe, isolamento de escopo, regra versionada idêntica para gatilho manual/simulado, palavras obrigatórias OR e proibidas, motivo de ausência, expiração, aprovação e revalidação por destino. Conta não elegível, tarifa desconhecida, quota e permissão revogada devem produzir bloqueio ou opção manual explícita. O artefato final previsto é um rascunho exportável com proveniência. Esta etapa documenta o plano.

### Manifest V3 na Fase 10.1

Propor captura local por clique explícito em página autorizada, começando por URL pública e entrada manual. Quando os termos permitirem leitura de campos visíveis, usar `activeTab` para acesso temporário e `scripting` apenas para essa leitura. Permissões de host opcionais e específicas, solicitadas somente se necessárias. Mostrar campos e origem em preview, selecionar grupo/comunidade autorizado e confirmar antes de importar. Sem acesso permanente a todas as páginas, cookies, sessões, storage do marketplace, endpoints privados, QR ou observação em segundo plano. Sem disparo. Se houver integração posterior com o Hub, token próprio restrito/revogável, servidor autenticado, RLS, schemas e dedupe. Fallback se a página ou permissão for inadequada é colar URL oficial manualmente. Sem publicação ou instalação neste checkpoint. [Permissão activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab/) · [Matriz](MARKETPLACE_CAPABILITIES.md)
