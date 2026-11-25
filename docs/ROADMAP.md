# Roadmap sujeito a autorização

Nenhuma fase seguinte começa automaticamente. Ordem abaixo é proposta; não representa compromisso de capacidade das APIs.

| Fase | Entrega | Gate de entrada / aceite |
| --- | --- | --- |
| 0 — Arquitetura | Documentos, decisões, riscos e critérios | Briefing recebido; revisão humana do pacote |
| 1 — Fundação | Backend gratuito confirmado, autenticação, comunidades, migrations, RLS | Autorização expressa; custos/stack resolvidos; isolamento entre dois nichos testado |
| 2 — Execução determinística | Workflows, jobs, aprovações, auditoria, manual/templates e Cost Guardian | Fase 1 aceita; reserva concorrente e bloqueio financeiro testados sem APIs externas |
| 3 — IA gratuita | Provedores Cloudflare elegíveis; modelos/local opcionais | Política da conta, acesso oficial, tarifa e credenciais validados; nenhuma inferência antes do gate |
| 4 — Ofertas piloto | Importação e capacidades oficiais de marketplaces | Programa afiliado autorizado; fontes gratuitas aprovadas; preços/links com origem |
| 5 — Conteúdo e canais | Materiais, landing, agenda e publicação autorizada | Canal com permissões; divulgação afiliada; confirmação de entrega e idempotência |
| 6 — Métricas e otimização | Indicadores reais e sugestões versionadas | Fonte disponível; privacidade e limites preservados; nenhuma receita inventada |

## Testes de aceite a implementar nas fases correspondentes

- Política financeira: operação que exige qualquer valor acima de R$ 0,00 é negada sem chamar o provedor.
- Franquia compartilhada: texto reserva 6.000 e imagem tenta 5.000 Neurons em bucket de 10.000; segunda reserva é negada (margem zero no cenário de teste).
- Margem: com teto 10.000 e margem proposta de 10%, 9.000 é teto operacional, não franquia adicional.
- Concorrência: duas reservas concorrentes não ultrapassam saldo; timeout de inferência incerta não libera consumo presumido.
- Conta externa: consumo fora do Hub reduz saldo; informação desatualizada bloqueia novo trabalho.
- Segurança: usuário da comunidade A não lê/altera B nem vincula oferta A ao canal B; visitante não acessa dados privados.
- Nichos: piloto automotivo e uma segunda comunidade usam as mesmas estruturas sem condicionais automotivos genéricos.
- Workflow: aprovação vale somente para versão aprovada; retomada não duplica artefato/publicação.
- Integrações: link afiliado real/importado tem origem; publicação sem confirmação fica desconhecida, não bem-sucedida.
- Provedores: Gemini e modelos pagos não são invocados, nem como fallback.

Os números de cenário servem para testes futuros concretos. Nenhuma reserva, RLS ou integração é exercitada pela entrega documental da Fase 0.