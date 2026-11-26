# Provedores de IA textual

**Contratos planejados; nenhum adaptador implementado ou chamado.** Não foi gerado texto por API externa nesta entrega.

| Provedor | Papel | Estado inicial / condição |
| --- | --- | --- |
| ChatGPTPlanProvider | Recurso oficialmente incluído na assinatura | Bloqueado até comprovar elegibilidade e meio oficial; assinatura não vira API Key |
| CloudflareTextProvider | Inferência textual na franquia gratuita | Candidato; selecionar modelo gratuito permitido e verificar conta antes de ativar |
| OllamaProvider | Inferência local opcional | Desabilitado; exige hardware já disponível e acesso seguro |
| ManualAIProvider | Importação estruturada externa | Planejado; validação de schema, autoria, proveniência e aprovação |
| TemplateProvider | Contingência determinística | Planejado; templates versionados sem inferência |

## Contrato documental

Operação `generateText` recebe tarefa, idioma, schema de saída, limite de entrada/saída, contexto autorizado e referência de reserva. Retorna resultado validado, provedor/modelo, proveniência e consumo com unidade e grau de certeza. `capabilities` informa disponibilidade, requisitos, limites e validade da verificação; não é uma chamada genérica para descobrir custo por tentativa.

ManualAIProvider utiliza importação, não finge endpoint online. TemplateProvider aplica variáveis sanitizadas e marca a origem como determinística. Ollama não é fallback automático quando requer computador novo, instalação não autorizada ou serviço acessível somente em localhost.

## ChatGPT e Codex

[Fonte oficial de billing](https://help.openai.com/en/articles/9039756-billing-settings-in-chatgpt-vs-platform), consultada em 25/11/2026: API e ChatGPT são cobrados separadamente; benefícios eventualmente incluídos dependem de elegibilidade. Não confirmar API gratuita para o administrador. Verificar documentação oficial do benefício, identidade elegível, permissões de automação, validade e limite antes de propor uso. Não usar cookies Web, endpoints privados, sessão do Codex ou tokens internos como API.

Enquanto isso, o administrador pode produzir material na ferramenta que já possui e importá-lo manualmente em fase futura. O Hub não controla nem presume a franquia dessa atividade externa.

## Seleção Cloudflare

[Fonte oficial de tarifas](https://developers.cloudflare.com/workers-ai/platform/pricing/), consultada em 25/11/2026. Catálogo possui modelos que exigem pagamento; nome conhecido ou preço unitário listado não prova acesso gratuito. Modelo textual inicial não foi escolhido, pois plano e capacidades da conta não foram validados.

Futuro catálogo allowlist registra ID oficial, licença, tamanho de contexto, limites de tokens, unidade/tarifa, disponibilidade Free, necessidade de método de pagamento, data de verificação e estado da conta. Ausência de qualquer prova obrigatória bloqueia a chamada. Texto compete com imagens no mesmo bucket diário.

## Descoberta da Fase 2 — 26/11/2026

A OpenAI documenta Sign in with ChatGPT para identidade em sites de parceiros e um preview distinto de uso de plano via Responses para apps elegíveis abertos/locais. Apps comerciais ou hospedados remotamente seguem processo separado. Codex CLI/SDK têm caminhos oficiais para sessões e automação Codex, sem evidência de elegibilidade do Hub como aplicação de inferência hospedada. ChatGPTPlanProvider continua bloqueado. [Preview OSS](https://developers.openai.com/siwc/token-sharing-open-source) · [Website](https://developers.openai.com/siwc/website)

Llama 3.2 3B e Mistral Small 3.1 24B são candidatos públicos para comparação, sem seleção ou teste. A inferência só entra após confirmar o trajeto oficial via gateway, modelo/conta Free e reservas comuns de texto/imagem. [Matriz Cloudflare e OpenAI](PHASE_02_FEASIBILITY.md)

## Qualidade e segurança

Tratar fontes como dados não confiáveis. Não permitir que um prompt altere orçamento, autoridade ou ferramentas. Saída estruturada precisa passar schema; análise separa fato, hipótese e fonte. Erros de schema recebem retry limitado somente quando há saldo; depois revisão manual/pausa. Cache respeita escopo, versão de configurações e expiração.
