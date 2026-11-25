# Segurança — plano inicial

**Controles de domínio aqui descritos são planejados, não instalados.** A base possui proteção CSRF de server functions e tratamento de erros; isso não fornece autenticação ou isolamento do produto.

## Ameaças e controles

| Ameaça | Controle proposto | Verificação futura |
| --- | --- | --- |
| Acesso entre comunidades (IDOR) | RLS, associação autorizada e FKs compostas | Trocar IDs de comunidade/recurso deve negar |
| Elevação de privilégio | Papéis em fonte confiável; validação no servidor | Usuário não promove a si próprio |
| Chave no navegador/log | Secret manager, DTOs mínimos, redaction | Inspeção de bundle e logs sem credenciais |
| Prompt injection em ofertas | Tratar texto externo como dado, ferramentas allowlist, schemas | Oferta maliciosa não publica nem altera limites |
| XSS/HTML/SVG ativo | Sanitização, escaping, validação de MIME e conteúdo | Scripts e referências perigosas rejeitados |
| SSRF e redirects perigosos | HTTPS permitido, hosts aprovados, revalidação de redirects | Negar IPs internos, loopback, metadados e DNS rebinding |
| Cobrança involuntária | Cost Guardian fail-closed e plano Free verificado | Modelo pago não chega ao adaptador |
| Duplicação por retry | Idempotência, outbox/job e reconciliação | Timeout não gera post duplicado |
| Callback falso | Assinatura oficial, prazo e proteção replay | Evento inválido não altera publicação |
| Dados pessoais excessivos | Minimização e acesso restrito | Métricas sem identificar membros desnecessariamente |

## Fronteiras

Browser envia intenção, não autorização. Schemas Zod validam formatos, tamanhos, enumerações e saídas de provedores. Todas as server functions protegidas verificam sessão e escopo; guard da página é somente experiência de navegação. Rotas públicas de callback autenticam o remetente dentro do handler.

Segredos nunca usam prefixo de exposição ao browser, nunca ficam no Git, nunca entram em prompts, exportações ou logs. Tokens com menor escopo possível, rotação/revogação e auditoria. `secret_ref` é referência opaca, não valor da chave. Não importar clientes privilegiados no código público nem usar admin para leituras ordinárias.

## Conteúdo e publicação

Oferta guarda origem, instante e validade; preço desatualizado bloqueia publicação automática. Sem histórico confiável, não afirmar desconto calculado sobre preço anterior. Imagens geradas não representam fielmente produto real por presunção; distinguir material promocional e foto oficial licenciada.

Aprovação se vincula à versão/hash do conteúdo e ao canal; edição invalida decisão anterior. Publisher não consegue elevar limite financeiro ou autorizar conta. Disclosure afiliado e regras do canal são obrigatórios conforme programa/legislação aplicável.

## Operação e LGPD

Definir finalidade, base legal, retenção, exclusão e contato do controlador antes de coletar dados pessoais. Não colher membros de grupos por scraping. Métricas preferencialmente agregadas. Conteúdo importado exige direitos de uso e revisão.

Incidente: pausar jobs afetados, revogar tokens, preservar evidência sanitizada, reconciliar consumo/efeitos externos e retomar somente após autorização apropriada. Backup/exportação gratuitos e restauração precisam ser verificados; não prometer disponibilidade ou recuperação não contratadas.