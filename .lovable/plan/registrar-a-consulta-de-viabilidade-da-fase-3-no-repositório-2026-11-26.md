# Registrar a consulta de viabilidade da Fase 3 no repositório

Criar o arquivo `docs/PHASE_03_GATEWAY_FEASIBILITY.md` na branch atual e confirmar a mudança, para que o GitHub a receba e ela possa ser lida no Codex. Somente documentação: código, banco, segredos, faturamento e conectores não serão alterados, e a Fase 3 não começa.

## Conteúdo do arquivo

1. **Contexto:** a data (26/11/2026), a regra de gateway do bloco gerenciado do AGENTS.md e uma referência ao checkpoint `d51efe2`.
2. **Caminho oficial:** a diferença entre o gateway de IA do Lovable, que só atende os modelos oferecidos pela Lovable e não inclui a Cloudflare, e o gateway de conectores. Também registra:
   - que existe um conector nativo `cloudflare`, que repassa a API v4 sem filtrar endpoints, mas cuja documentação não cita Workers AI;
   - que o conector REST customizado não é o caminho normal, porque já existe um conector nativo;
   - que nenhuma fonte confirma que essa rota atende à regra de modelos.
3. **Quem pagaria em cada camada:**
   - **Cloudflare:** a conta dona do token. O plano dela ainda não foi verificado.
   - **Conector:** pode consumir créditos de execução, mas a cobrança não foi confirmada.
   - **Server Functions e backend:** usam a franquia de 20 créditos de Cloud e, quando ela acaba, o projeto é pausado.
   - **Gateway de IA:** 4 créditos por mês, mas não se aplica a esta rota.
   - **Dados do workspace lidos nesta consulta:** plano Free (assinatura cancelada em 14/07/2026), nenhum limite de crédito, recarga automática nunca configurada.
4. **Controles:** separa o bloqueio pelo provedor (Cloudflare Free), os limites Lovable que só agem depois de contabilizar o uso, os alertas e a reserva simulada da migration 0006. Registra também as lacunas que continuam abertas: chamadas concorrentes, medição atrasada e uso feito fora do Hub.
5. **Classificação: NÃO COMPROVADA.** Inclui as 4 pendências e a pergunta exata para o suporte, com o acréscimo sobre o comportamento no plano Free.
6. **Fontes oficiais:** os links da Cloudflare e da Lovable.

## Detalhes técnicos

- Uma linha em `docs/PROJECT_STATUS.md` apontando para o novo arquivo.
- Um commit com a mensagem "docs: registra consulta de viabilidade de gateway da Fase 3", sem nenhuma outra alteração.
