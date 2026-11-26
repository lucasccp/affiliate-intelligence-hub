# Geração de imagens

**Arquitetura apenas; não há imagens geradas, upload operacional ou chamadas de modelos.** Consultas a fontes oficiais em 25/11/2026 (UTC).

## Provedores

| Provedor | Papel | Estado |
| --- | --- | --- |
| CloudflareImageProvider | Principal, condicionado à franquia gratuita | Planejado, não configurado |
| ComfyUIImageProvider | Geração/edição local opcional | Desabilitado; hardware existente e ponte segura necessários |
| ManualImageProvider | Upload de imagens externas licenciadas | Planejado; MIME, tamanho, direitos e segurança validados |
| TemplateImageProvider | SVG/Canvas determinísticos | Planejado; sem endpoint de inferência |
| GeminiImageProvider / Nano Banana | Integração eventual | Bloqueado inicialmente; sem fallback |

## Modelos e evidências

| Modelo | Catálogo oficial | Tarifa pública observada | Elegibilidade operacional |
| --- | --- | --- | --- |
| FLUX.1 Schnell | `@cf/black-forest-labs/flux-1-schnell` | 4,80 Neurons/tile 512×512 + 9,60 Neurons/passo; equivalente listado US$ 0,0000528/tile + US$ 0,0001056/passo | Candidato inicial sujeito à confirmação Free da conta e reserva |
| FLUX.2 Klein 4B | `@cf/black-forest-labs/flux-2-klein-4b` | 5,37 Neurons/tile de entrada + 26,05 Neurons/tile de saída; US$ 0,000059/entrada + US$ 0,000287/saída | Catalogado para geração/edição; contrato e acesso da conta ainda não validados |
| FLUX.2 Klein 9B | `@cf/black-forest-labs/flux-2-klein-9b` na tabela de tarifas | 1.363,64 Neurons/primeiro MP; 181,82/MP adicional ou MP de entrada | Não selecionado; nenhuma disponibilidade gratuita presumida |

Fontes: [pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Schnell](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/), [Klein 4B](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/).

Preço monetário publicado serve para entender consumo e risco, **não autoriza pagar**. Uma tarifa existir na página não torna o modelo pago dentro de uma franquia validada, nem prova acesso gratuito. Não confundir variantes Klein. Schnell documenta saída base64, default de 4 passos e máximo de 8; Klein apresenta contrato multipart e saída base64, a detalhar oficialmente antes da implementação.

Não projetar quantidade diária garantida de imagens: resolução, passos, entradas, variante e texto usam a mesma franquia da conta. A fórmula de tiles e parâmetros aceitos deve ser validada contra o schema/modelo antes de estimar reserva; os valores desta tabela não são um estimador implementado.

## Fluxo futuro

Briefing aprovado → conferir uso/licença e fidelidade requerida → selecionar capacidade elegível → verificar cache → reservar no Cost Guardian → gerar/importar/renderizar → validar saída → armazenar artefato privado → revisão → publicar apenas versão autorizada.

Contrato de geração separa prompt, parâmetros limitados, dimensão, formato e licença; edição acrescenta artefatos de entrada autorizados. Retorno inclui origem, modelo/versão quando disponível, hash, MIME, dimensões e consumo reconciliado. Não presumir edição disponível no Schnell porque existe no Klein.

## Marca e material promocional

Logotipo final preferencialmente vetorial com texto verificável, inclusive via template SVG; imagem gerativa pode não produzir tipografia correta ou unicidade de marca. Material de produto usa fotos oficiais licenciadas ou upload autorizado quando fidelidade for necessária. Imagem ilustrativa gerada não substitui evidência do produto real.

SVG importado deve ser sanitizado contra scripts, eventos, referências externas e recursos ativos; Canvas/template exportado tem dimensões máximas estáveis. Revisar contraste, direitos, marcas e aprovações. Uploads e artefatos respeitam quota de storage e egress além da franquia de IA.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Kit de convite e páginas ponte reutilizam Brand Studio/Image Studio, com upload licenciado e composição determinística. Referência UI SenaFlow aceita JPG/PNG/WebP até 5 MB; limite próprio deve respeitar storage e segurança, configurável após validação. Reutilizar mesma arte em múltiplos destinos autorizados sem nova inferência. Vídeo Studio futuro usa ativos autorizados e FFmpeg local quando viável, sem custo pago.
