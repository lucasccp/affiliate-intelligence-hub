# Piloto determinístico

Em 26/11/2026, o administrador aceitou a Fase 1 e autorizou a etapa determinística da Fase 2 prevista no roadmap. A descoberta técnica está na branch `docs/phase-02-feasibility`. O piloto tem orçamento adicional de R$ 0,00. Os R$ 50 discutidos são uma possibilidade futura. A Garagem de Ofertas é o piloto, com regras reutilizáveis por outros nichos.

As regras TypeScript de oferta validam fonte HTTPS, preço em centavos e intervalo de validade, geram um rascunho em texto e limitam a exportação à versão atual aprovada e vigente. A regra de admissão bloqueia custo adicional ou desconhecido e calcula disponibilidade após margem, consumo contabilizado e reservas. Os testes locais simulam estado de conta compartilhada. Essa base carece da ligação ao banco e à interface.

## Solicitação ao Lovable

Gerar, revisar e aplicar no ambiente de desenvolvimento as migrations e tipos gerenciados para o piloto abaixo. Preservar as dez tabelas atuais, autenticação e seed. Toda alteração de domínio deve ocorrer em uma transação autorizada. O piloto não requer credenciais, APIs externas ou faturamento.

- Manter ofertas e revisões imutáveis com vínculo composto a comunidade/workspace. Gravar versão, preço, fonte, observação, validade e texto gerado. Usar aprovação com versão exata, usuário e instante. Edição cria nova versão e exportação só retorna a versão atual aprovada e não expirada. Usar relógio do banco e registrar eventos com autoria. Aprovação e exportação devem usar a mesma autorização de gestão da comunidade, com histórico legível no workspace.
- Persistir workflow e jobs com chave idempotente por workflow/etapa/versão, claim atômico, lease, tentativa limitada e conclusão protegida contra lease vencido. Se uma tentativa for retomada, impedir duplicação de revisão ou artefato. Disparo manual nesta entrega. Usar a trilha de auditoria existente se compatível ou manter eventos append-only com a mesma fronteira de autorização.
- Representar o saldo por conta e período, compartilhado entre texto e imagem. Validar custo adicional zero, consumo externo contabilizado, validade do snapshot e margem. Bloquear a linha da conta e inserir a reserva na mesma transação. Deduplicar a operação. Uma tentativa enviada com resultado incerto permanece contabilizada. Testar exclusivamente com provedor simulado.
- Aplicar RLS e grants mínimos. Visitantes ficam sem acesso. Membros autenticados leem somente o workspace autorizado. Mutações exigem papel de gestão. Restringir operações que permitam forjar aprovação, auditoria, estado ou saldo pela Data API. Testar vínculos cruzados, leitura/escrita entre duas contas isoladas, edição após aprovação e corrida de reservas. Retornar tipos gerados para conectar Server Functions autenticadas e a interface do piloto.

O aceite exige a cadeia completa persistida e testes das transações, isolamento e retomada. A Fase 3 requer autorização separada e confirmação do transporte e da elegibilidade financeira.
