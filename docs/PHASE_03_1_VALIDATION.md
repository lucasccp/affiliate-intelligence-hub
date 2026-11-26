# Checkpoint da Fase 3.1 — Captura assistida por URL

26/11/2026. Implementação no Codex, baseada na develop em `c49b95c6`. Aceite no preview autenticado pendente.

Em Comunidades → Ofertas, **Cadastrar por link** valida o endereço HTTPS e preenche a fonte com o endereço informado, incluindo parâmetros de afiliado. A interface identifica a origem manual assistida. O operador preenche nome, preço observado e validade interna usando o formulário existente. O prazo interno mantém o controle de ofertas vigentes já usado na aprovação e no compartilhamento. A plataforma usa o fluxo existente de rascunho, aprovação por revisão e preparo de mensagem de WhatsApp.

## Verificação

- Vitest local, excluída a suíte que exige banco de teste: 25 testes em quatro arquivos. A cobertura inclui preservação dos parâmetros do endereço, rejeição de entradas inválidas e os testes existentes de revisão e exportação.
- Build e TypeScript passaram. ESLint com zero erros e oito avisos existentes de Fast Refresh.
- Preview autenticado, persistência em banco remoto e abertura do WhatsApp no celular pendem de validação na versão entregue. Os resultados locais não comprovam esses pontos.

## Aceite no Lovable

No preview autenticado da develop, selecione Garagem de Ofertas e abra Ofertas → Cadastrar por link. Teste primeiro `http://example.com/suporte`, que deve ser rejeitado. Cole `https://example.com/suporte?ref=teste`, confirme a fonte preenchida, informe nome, preço e prazo interno futuro e crie o rascunho. Aprove a revisão atual. Em Conteúdo → WhatsApp, selecione a oferta e um template. Confira a mensagem e o endereço no WhatsApp. Edite a oferta após a aprovação e confirme que a nova revisão precisa ser aprovada. Com uma oferta de prazo curto, confirme o bloqueio após vencer.

Parecer financeiro: R$ 0,00 de custo adicional. O cadastro usa o formulário e a persistência existentes. A URL é tratada como texto e nenhum provedor é chamado. A próxima etapa é o aceite em preview, com autorização separada para qualquer fase posterior.
