# Roadmap V4.0 — ordem autorizável

Atualização 26/11/2026. Fonte de prompts e aceite: [PROJECT_MASTER_GUIDE.md](PROJECT_MASTER_GUIDE.md). Benchmark: [COMPETITIVE_BENCHMARK.md](COMPETITIVE_BENCHMARK.md). Fase 1 aceita. Fases 2, 2.1 e 3 assistida integradas em develop. Próxima prioridade: Fase 3.1. Inferência real adiada. Nenhuma fase futura autorizada automaticamente. Gate financeiro obrigatório; pesquisa documental pode ser autorizada separadamente.

| Fase | Entrega | Ferramenta | Estado |
|---|---|---|---|
| 0 | Governança e arquitetura | Lovable. | Concluída |
| 1 | Fundação | Lovable. | Com ressalvas |
| 2 | Integration Discovery e viabilidade | Codex. | Descoberta e piloto integrados em develop. Aceite autenticado reportado. |
| 2.1 | Marketplace Integration Research e benchmark | Codex. | Pesquisa concluída com ressalvas. |
| 3 | AI Core e Cost Guardian | Codex → Lovable se necessário → GitHub → Codex. | Assistida em develop. Validação em preview pendente. |
| 3.1 | Captura assistida por URL e preparo para WhatsApp | Codex, Lovable só se necessário. | Prioridade atual, implementação aguarda autorização. |
| 4 | Cloudflare Workers AI — textos | Codex + Lovable. | Bloqueada para inferência real. |
| 5 | Image Generation Engine | Lovable + Codex. | Adiada. |
| 6 | OpenAI e AI Worker Local | Codex. | Adiada. |
| 7 | Community Factory | Lovable + Codex. | Planejada |
| 8 | Brand Studio | Lovable + Codex. | Planejada |
| 9 | Landing Page Builder | Lovable + Codex. | Planejada |
| 10 | Channel Hub | Lovable + Codex. | Planejada |
| 10.1 | Affiliate Capture Extension (antecipada) | Codex + Lovable se backend gerenciado necessário. | Planejada |
| 11 | Offer Hunter | Codex + Lovable. | Planejada |
| 12 | Affiliate Intelligence | Lovable + Codex. | Planejada |
| 13 | Content Engine | Lovable + Codex. | Planejada |
| 14 | Automation & Publisher | Codex + Lovable. | Planejada |
| 15 | Growth Analytics e Orquestrador | Codex + Lovable. | Planejada |
| 16 | Affiliate Capture Extension: evolução | Codex + Lovable se necessário. | Planejada |
| 17 | Video Studio | Codex + Lovable. | Planejada |
| 18 | Mobile PWA | Codex. | Planejada |
| 19 | Expansão de marketplaces | Codex + Lovable. | Planejada |
| 20 | WordPress e integrações externas | Codex + Lovable. | Planejada |

Fases 2.1 e 10.1 inseridas sem renumerar IDs; seguir a prioridade operacional aprovada acima da sequência histórica. Fase 16 amplia extensão já criada em 10.1. Fases híbridas começam no Codex, Lovable somente para recursos gerenciados. Critérios detalhados no manual. Após cada fase, checkpoint e autorização humana.

## Prioridade operacional — 26/11/2026

O administrador priorizou o fluxo de ofertas para WhatsApp e adiou integrações de IA. A próxima etapa é a Fase 3.1, captura assistida por URL e preparação de ofertas, com R$ 0,00 de custo adicional. A aprovação desta ordem não inicia a implementação. Os IDs e escopos das fases posteriores continuam como referência.

A entrega começa pela entrada de uma URL HTTPS de anúncio e preenchimento assistido dos dados confirmados pelo operador, usando a fundação do piloto. O objetivo é reduzir a digitação e reutilizar os templates de WhatsApp ligados à revisão aprovada. A captura de campos em páginas, extensão, API de marketplace, busca automática e envio direto a grupos dependem de capacidade oficial e autorização própria.

## Critérios transversais
R$0 adicional, quotas compartilhadas com reserva/margem/reconciliação, RLS e isolamento, idempotência, proveniência, aprovação versionada, nenhuma API paga ou não autorizada. Cenários de teste históricos continuam válidos: duas reservas 6000+5000 em teto 10000 não cabem; margem reduz teto, não aumenta franquia. Testar concorrência, consumo externo, entrega incerta, links reais e fallback manual. Margem inicial de planejamento V4: 20%, ajustável somente com evidência e autorização.

## Consolidação V4.0 — SenaFlow (26/11/2026)

Complementos: 2/2.1 pesquisa SenaFlow; 7 grupos; 9 páginas ponte; 10 destinos; 10.1 captura; 11 regras, guia e coleta; 12 filtros e aprovação; 13 convite; 14 Produção, fila e agenda; 15 métricas. Aceite no manual mestre. Consulte a prioridade operacional atual.
