# Política de custo adicional zero

**Orçamento adicional autorizado: R$ 0,00.** Este limite prevalece sobre conveniência e grau de automação. Nenhum faturamento, crédito, serviço ou provedor foi ativado nesta fase.

## Proibições

Contratar serviços pagos, servidores, proxies ou scraping; ativar faturamento; comprar créditos; realizar chamadas a APIs pagas; upgrade automático; Lovable AI com cobrança adicional; fallback pago. Não usar trial com risco de cobrança posterior ou chave vinculada a cobrança sem barreira verificável. Aprovação operacional de um conteúdo não autoriza despesa.

Assinatura ChatGPT/Codex já existente não constitui chave de API gratuita. Recurso incluído só poderá ser usado com elegibilidade oficial demonstrada, limites conhecidos e sem cobrar além da assinatura existente. Cookies, endpoints privados e credenciais internas não são meios de integração.

## Fontes e limites observados

Consulta oficial em 25/11/2026 (UTC), apenas leitura:

- [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/): 10.000 Neurons/dia gratuitos, reset às 00:00 UTC; Workers Free falha ao exceder. Plano Paid permite excedente cobrado a US$ 0,011/1.000 Neurons e é proibido. Certos modelos exigem método de pagamento ou créditos mesmo com franquia: não ficam elegíveis por terem sido listados no catálogo.
- [Backend gratuito solicitado — pricing oficial](https://supabase.com/pricing): Free exibe US$ 0/mês, até 2 projetos ativos, 500 MB de banco, 1 GB de storage, 5 GB de egress e 5 GB de cached egress; pausa após uma semana de inatividade. São observações públicas, não comprovação da conta nem garantia de hospedagem gratuita do app.
- [OpenAI — separação de billing](https://help.openai.com/en/articles/9039756-billing-settings-in-chatgpt-vs-platform): ChatGPT e API possuem faturamentos separados. Eventuais benefícios oficiais dependem de elegibilidade; não foram verificados para esta conta.

Outros limites (requisições Workers, CPU, execuções, storage, auth, scheduler, egress, CI e GitHub) precisam ser verificados separadamente. Franquia de IA não cobre toda a infraestrutura. Preços podem mudar; revalidar antes de qualquer ativação e ao alterar modelo.

## Cost Guardian — algoritmo proposto, não implementado

1. Normalizar intenção: workspace, comunidade, provedor, conta, modelo, modalidade e dimensão máxima da operação.
2. Negar provedor pago, modelo sem elegibilidade comprovada, plano inadequado, configuração desatualizada ou custo desconhecido.
3. Consultar cache com chave incluindo comunidade, versão, prompt/input, modelo e licença; não cruzar conteúdo privado entre comunidades.
4. Consultar consumo de toda a conta, inclusive fora do Hub; ledger local sozinho não prova saldo disponível.
5. Calcular estimativa superior conservadora na unidade oficial, incluindo tokens, tiles, passos e limites da requisição. Sem limite superior confiável: negar.
6. Em transação, reservar no bucket compartilhado e verificar simultaneamente limite global, comunidade, provedor, margem e concorrência.
7. Chamar adaptador somente com reserva válida, timeout e máximo de consumo definido.
8. Reconciliar consumo real, liberar somente saldo comprovadamente não usado e auditar resultado. Consumo incerto permanece contabilizado conservadoramente.

### Compartilhamento e fórmula

Uma conta Cloudflare tem **um** bucket diário para texto e imagens, abrangendo modelos elegíveis. Sub-limites por comunidade/provedor não criam franquias novas. Buckets de outras contas têm unidades separadas; limite financeiro global em BRL permanece zero e não é convertido em Neurons.

`disponível = max(0, teto_confirmado − margem − consumo_contabilizado − reservas_ativas)`.

Consumo contabilizado combina ledger e observação externa sem somá-los duas vezes. Reconciliar por identificadores/período; quando não conciliável, adotar limite conservador e pausar. Proposta inicial: margem de 10% e concorrência de uma inferência por conta, configuráveis somente sem violar a política financeira. Com teto confirmado de 10.000, margem de 1.000 deixa teto operacional de 9.000, compartilhado; isso não é garantia de volume de imagens.

Reservas possuem TTL, mas expiração não prova não consumo. Reserva não enviada pode ser liberada; envio com timeout fica em reconciliação. Retry requer nova autorização de saldo e idempotência quando suportada. Reset diário não reabre operação automaticamente se plano/capacidade continuarem inválidos. Se consumo externo puder ocorrer simultaneamente sem observação suficiente, pausar ou dedicar conta exclusivamente à operação antes de automatizar.

### Fail-closed e contingência

Quota esgotada, tarifa desconhecida, API indisponível, contador stale ou plano não confirmado → pausa explícita. Contingência apenas manual, template/SVG/Canvas ou infraestrutura local já disponível e aceita, sem contratação. Não trocar automaticamente para Gemini, OpenAI API, gateway pago ou outro provedor.

Auditar reserva, liberação, reconciliação, bloqueio, tentativa e mudança de configuração; sem tokens ou prompts sensíveis nos logs. Ledger e política são controlados no servidor; agente e browser não podem aumentar seus próprios limites.

## Riscos financeiros residuais

Custo zero não significa infraestrutura ilimitada nem operação sem energia/internet/trabalho humano. Recursos locais só são opção se não exigirem compra autorizada adicional. Custos do ambiente Lovable e da assinatura existente são externos ao orçamento operacional planejado; nenhuma gratuidade da hospedagem foi certificada. Se executar uma fase exigir compra de créditos ou upgrade, interromper e explicar o impedimento.