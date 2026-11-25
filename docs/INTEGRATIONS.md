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