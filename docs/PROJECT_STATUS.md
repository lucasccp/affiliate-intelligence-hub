# Status do projeto

Referência: 25/11/2026 (UTC) · **Fundação implementada na main, com ressalvas registradas**. Consulte a seção V4.0 para o estado das branches.

## Estado integrado em develop — 26/11/2026

`develop` é a branch de trabalho e preview no Lovable. Integra os requisitos V4.0, a descoberta da Fase 2, a pesquisa 2.1, o piloto e a Fase 3 assistida. Os artefatos gerenciados do piloto foram incorporados como entregues pelo Lovable. A main permanece como referência da fundação e do planejamento.

- **Fase 2:** piloto de ofertas em Comunidades com criação, template, edição versionada, aprovação e exportação autenticada. O administrador relatou aceite do roteiro no preview, sem SHA informado. [Checkpoint do piloto](PHASE_02_VALIDATION.md) · [Aceite reportado](PHASE_03_ENTRY_CHECKPOINT.md)
- **Fase 2.1:** pesquisa de marketplaces e benchmark concluída com ressalvas. [Checkpoint](PHASE_02_1_VALIDATION.md)
- **Fase 3 assistida:** templates, prompts copiáveis, importação local e simulação de franquia. Aba Conteúdo em Comunidades. Gestão, Ofertas e Conteúdo têm navegação própria. Materiais importados ficam na sessão. Validação autenticada do painel aguarda execução no preview. [Checkpoint](PHASE_03_ASSISTED_VALIDATION.md)
- **Inferência real:** Fases 4 e 5 bloqueadas até comprovação de rota e custo zero. [Parecer de gateway](PHASE_03_GATEWAY_FEASIBILITY.md)

## Entrega

Aplicação administrativa pt-BR com temas claro/escuro, sidebar recolhível/mobile, header, seletor global, dashboard, comunidades e configurações. Login e cadastro e-mail/senha, recuperação e logout implementados; Google/Lovable configurados. Perfil, preferências e workspace pessoal persistidos. CRUD atômico de comunidades com filtros e paginação real; Garagem de Ofertas criada por lifecycle de cadastro idempotente. Dashboard mostra contagens e atividade real, com métricas futuras indisponíveis.

10 tabelas, UUIDs, timestamps, constraints, índices, FKs compostas, RLS e grants mínimos. Migrations gerenciadas 0000–0004. Papéis em tabela protegida; orçamento imutável zero; limites operacionais validados no banco e servidor. Documentação da Fase 0 preservada como referência histórica e atualizada nos pontos da fundação.

## Não implementado

Agentes executáveis, Cost Guardian de inferência, geração por IA, ofertas, aprovações, publicações, cliques/comissões, scheduler, worker local e conexões de marketplace/canal. Nenhum mock apresentado como integração. Canais e marketplaces cadastrados são somente destinos planejados; modo automático não executa tarefas. Nenhum Realtime, polling ou cron instalado.

Não há garantia financeira zero certificada para Cloud; não há teste ponta a ponta do recebimento/uso de e-mails de confirmação/recuperação nem roundtrip Google/Lovable. Não implementados convites, colaboração ou concessão de novos papéis pela interface.

## Evidências e validações

| Verificação | Resultado |
| --- | --- |
| Inspeção de código | AGENTS.md e todos os documentos da Fase 0 lidos; rotas e controles de fundação inspecionados |
| Preços/catálogo Cloudflare | Páginas oficiais de pricing, Schnell e Klein 4B responderam HTTP 200; franquia e tarifas documentadas |
| Faturamento OpenAI | Página oficial respondeu HTTP 200; assinatura e API separadas, elegibilidade da conta não comprovada |
| Plano gratuito de dados solicitado | Página oficial respondeu HTTP 200; limites públicos documentados, nenhuma conta vinculada |
| Integridade da documentação | Os 13 documentos solicitados existem; referências locais verificadas sem links quebrados |
| Testes | 16 testes aprovados: 8 regras determinísticas, 7 integração real, 1 roteamento; contas temporárias limpas com resultado verificado |
| Isolamento real | Duas contas: leitura/escrita cruzada recusada, associação FK inválida recusada, papéis não modificáveis, visitantes sem acesso |
| Seed real | Nome/slug/nicho/idioma/moeda/fuso/limite/status/modo e 8 categorias, 3 marketplaces, 4 canais exatos; idempotência validada |
| CRUD pela interface | Criar Clube de Leitura, recarregar, editar para active, confirmar contagem ativa no dashboard e excluir; perfil salvo/recarregado e tema escuro persistido |
| Workspace e navegação | Nome e limite do workspace salvos e confirmados após recarregar; sidebar recolhida a 68 px e reaberta; seletor global refletido no dashboard; nenhum erro de runtime no fluxo final |
| Login e logout | Login por senha de conta isolada confirmado; logout e acesso posterior a dashboard redirecionam a auth |
| Cadastro/recuperação por e-mail | Serviço recusou domínio reservado example.com nos testes; mensagens de erro tratadas. Não enviada mensagem a pessoa real; confirmação e reset completos permanecem não verificados |
| Linter de banco | 2 avisos intencionais de helpers booleanos autenticados SECURITY DEFINER; sem avisos anon nem índices pendentes após correção |
| Interface | Desktop 1280×1800 e mobile 384×673; dashboard/formulário sem overflow horizontal, navegação mobile e página de login verificadas visualmente |
| Lint | 0 erros; 8 avisos de Fast Refresh (6 existentes em shadcn e 2 contextos) |
| Build | Telemetria do ambiente registrou `build OK` após as alterações; não executado manualmente |
| Typecheck | Verificação automática do ambiente sem erros no último `build OK`; não executado manualmente |
| Custos | Auto top-up desativado; nenhum limite Cloud encontrado. Serviço pode consumir créditos existentes após a franquia. Nenhuma compra, upgrade ou chamada de IA realizada |

## Riscos e decisões pendentes

| Risco | Impacto | Mitigação / gate |
| --- | --- | --- |
| Stack do briefing diverge da plataforma | Supabase Edge Functions não são a fronteira de servidor disponível | Preservar TanStack; revisar divergência antes de Fase 1 |
| Gateway gerenciado não comprova caminho gratuito para os provedores desejados | Adaptadores Cloudflare/locais podem não ser habilitáveis neste ambiente | Validar transporte suportado e custo zero antes de IA; manter manual/templates se não houver |
| Cloud não equivale ao plano externo Free e não tem hard cap confirmado | Pode consumir créditos existentes após franquia | Ressalva financeira explícita; não certificar custo zero nem avançar para produção/fases seguintes |
| Modelos exigem pagamento ou mudam tarifa | Catálogo não garante gratuidade | Allowlist, fonte oficial e fail-closed |
| Consumo fora do Hub na mesma conta | Ledger local pode superestimar saldo | Reconciliação da conta inteira, margem e pausa quando informação insuficiente |
| Assinatura não inclui API genérica | ChatGPTPlanProvider pode não ser elegível | Importação manual; sem cookies/endpoints privados |
| API/programa afiliado indisponível | Descoberta/link automático limitado | Matriz por conta e modo manual identificado |
| Canal não autoriza automação desejada | Criação/publicação pode ser manual | Capabilities, checklist e evidência real |
| Quotas de banco/storage/execução gratuitas | Pausas, indisponibilidade e retenção reduzida | Limites separados, exportação e não prometer SLA |
| Node/modelos locais incompatíveis com hospedagem | SSR falha ou worker local inacessível | Processo opcional isolado; nenhuma dependência obrigatória |
| Publicação com timeout | Duplicação ou estado incerto | Idempotência/reconciliação; intervenção quando necessário |

## Aceite e próxima fase

Fundação funcional validada em contas de teste, não na conta pessoal do administrador. Seed fica disponível no workspace criado no seu cadastro. O administrador controla o Lovable existente. A ausência de bloqueio Cloud confirmado segue registrada para o gate de novas integrações. Validação de entrega e utilização de links de e-mail depende de uma caixa de e-mail real acessível ao administrador; não solicitamos senhas nem forjamos sessões de recuperação. O estado mais recente da Fase 2 consta na seção V4.0 abaixo. Critérios de produto e restrições permanecem no PRD e política financeira.

## Consolidação V4.0 e conclusão da pesquisa — 26/11/2026

A main em `85ff565` contém a fundação e a consolidação documental DivulgaLinks Pro/SenaFlow. A Fase 1 foi aceita pelo administrador. Confirmação e recuperação por e-mail e login Google/Lovable ponta a ponta continuam pendentes.

- **Fase 2 — descoberta documentada** na [branch de viabilidade](https://github.com/lucasccp/affiliate-intelligence-hub/tree/c33e3f7/docs). O parecer para inferência real continua bloqueado.
- **Fase 2 — piloto determinístico** na [branch do piloto](https://github.com/lucasccp/affiliate-intelligence-hub/commit/793bdabf59b10644ba87d8ffc08c069464ce4246), com migrations 0005–0006 do Lovable, cadastro, edição, template, aprovação por versão e exportação em Comunidades. O banco tem jobs de exportação e franquia simulada. A evidência se limita à branch até integração explícita.
- **Checkpoint do piloto:** 15 testes locais, build, TypeScript e lint com zero erros e oito avisos no Codex. O Lovable relatou 28 testes com contas isoladas e removidas. O Codex excluiu a suíte de banco. O relatório abaixo registra o aceite autenticado posteriormente informado pelo administrador. [Relatório do piloto](https://github.com/lucasccp/affiliate-intelligence-hub/blob/793bdab/docs/PHASE_02_VALIDATION.md)
- **Fase 2.1 — APPROVED_WITH_WARNINGS para pesquisa.** Matriz oficial, comparação, contratos e plano de POC documentados. Capturas sanitizadas do trial DivulgaLinks e verificação de credenciais, custos e capacidades por conta ainda pendentes. [Checkpoint](PHASE_02_1_VALIDATION.md)
- **Fase 3 — BLOCKED.** Próxima ação no Codex é verificar entrada: consolidar evidências, validar piloto autorizado e confirmar transporte oficial e custo adicional zero. Sem ativação de IA. O administrador controla o Lovable existente e o orçamento adicional segue em R$ 0,00.

## Checkpoint de entrada da Fase 3 — 26/11/2026

**BLOCKED.** No piloto `793bdab`, o Codex reproduziu 15 testes locais, instalação congelada, build e verificação TypeScript. Lint com zero erros e oito avisos. O fluxo autenticado e as suítes de banco ficaram pendentes por ausência de ambiente e contas de teste autorizados nesta sessão. Simulação da integração das branches apontou conflitos em AGENTS.md e PROJECT_STATUS.md. Nenhum merge foi efetuado.

A documentação oficial registra limites bloqueantes por projeto ou workspace em planos pagos, com possibilidade de ultrapassar o limiar antes do bloqueio. A rota Cloudflare via conector sob gestão do Lovable é candidata a avaliação. Compatibilidade com o gateway exigido pelo repositório, elegibilidade da conta, custo completo e bloqueio antes de cobrança permanecem sem comprovação. [Relatório e handoff](PHASE_03_ENTRY_CHECKPOINT.md)

## Retorno do Lovable sobre gateway — 26/11/2026

A rota Cloudflare para inferência permanece **NÃO COMPROVADA**. O Lovable relatou workspace Free e recarga automática desligada, sem confirmação oficial do uso do conector para modelos, faturamento por camada ou bloqueio prévio. O administrador posteriormente relatou o aceite autenticado do piloto. A Fase 3 assistida foi autorizada e seu estado integrado consta no início deste documento. [Relatório do Lovable](https://github.com/lucasccp/affiliate-intelligence-hub/blob/fb05439e1394d91e9a1ee9f3035dfb1af3154a57/docs/PHASE_03_GATEWAY_FEASIBILITY.md) · [Checkpoint](PHASE_03_ENTRY_CHECKPOINT.md)

## Teste do WhatsApp no celular — 26/11/2026

O administrador informou que executou no celular o teste de abertura do WhatsApp a partir do preview, no fluxo de oferta aprovada e mensagem por template. O relato não especifica a versão do preview, o resultado de cada verificação ou envio ao grupo. Não houve reprodução independente pelo Codex nesta rodada. A Fase 4 segue bloqueada para inferência real, e a priorização do fluxo assistido foi autorizada.

## Prioridade operacional — 26/11/2026

O administrador priorizou o fluxo de ofertas para WhatsApp e adiou integrações de IA. A Fase 3.1 implementou o cadastro assistido por URL em `develop` com R$ 0,00 de custo adicional. O aceite autenticado aguarda validação no preview. Os IDs e escopos das fases posteriores continuam como referência.

A entrega começa pela entrada de uma URL HTTPS de anúncio e preenchimento assistido dos dados confirmados pelo operador, usando a fundação do piloto. O objetivo é reduzir a digitação e reutilizar os templates de WhatsApp ligados à revisão aprovada. A captura de campos em páginas, extensão, API de marketplace, busca automática e envio direto a grupos dependem de capacidade oficial e autorização própria.

[Roadmap](ROADMAP.md) · [Prompt da Fase 3.1](PROJECT_MASTER_GUIDE.md#fase-31--captura-assistida-por-url-e-preparo-para-whatsapp)

## Checkpoint da Fase 3.1 — 26/11/2026

Cadastro por link HTTPS implementado no Piloto de ofertas. O operador confere e preenche a oferta antes de criar o rascunho. O painel reaproveita a aprovação por revisão e o preparo de mensagem por template. Build, TypeScript e 25 testes locais passaram. O lint apontou oito avisos existentes e zero erros. O aceite autenticado aguarda o preview da develop no Lovable. [Checkpoint](PHASE_03_1_VALIDATION.md)

### Revalidação da Fase 3.1 — 26/11/2026

A versão publicada da develop em `1b71ea9` passou em 25 testes locais, build e TypeScript. O lint retornou zero erros e oito avisos. Os 13 testes de banco ficaram sem execução. A captura da tela do operador confirma o preenchimento da fonte com um link encurtado. O restante do aceite autenticado segue pendente no Lovable. [Evidências e roteiro](PHASE_03_1_VALIDATION.md)
