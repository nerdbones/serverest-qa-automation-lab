# Plano de Testes

## Escopo

O escopo automatizado cobre:

- cadastro de usuários;
- autenticação;
- gestão de produtos;
- criação e validação de carrinho na API;
- fluxo de cliente com lista de compras no frontend.

## Fora de escopo

Não foram incluídos neste projeto:

- testes de carga;
- testes de segurança ofensiva;
- validação visual pixel a pixel;
- testes cross-browser extensivos;
- testes de acessibilidade automatizada.

## Critérios de entrada

- Dependências instaladas com `npm ci`.
- Acesso aos ambientes públicos do ServeRest.
- Node.js compatível com a versão indicada no `.nvmrc`.

## Critérios de saída

- Todos os testes automatizados passando.
- `npm run lint` sem erros.
- `npm run format:check` sem divergências.
- Evidências disponíveis em vídeos, screenshots de falha e logs de pipeline.

## Massa de dados

A massa é gerada dinamicamente a cada execução, reduzindo dependência de dados pré-existentes.

Usuários e produtos criados pela automação usam prefixos identificáveis, mas com sufixos únicos baseados em timestamp e caracteres aleatórios.

## Estratégia de limpeza

Sempre que possível, os cenários removem usuários e produtos criados durante a execução.

No caso de carrinhos, a automação cancela a compra para liberar o usuário e reabastecer o estoque do produto.

## Riscos e mitigação

| Risco                           | Mitigação                                                  |
| ------------------------------- | ---------------------------------------------------------- |
| Ambiente público indisponível   | Pipeline evidencia falha e logs ajudam na análise          |
| Dados de terceiros interferirem | Massa dinâmica por execução                                |
| Produto preso em carrinho       | Cancelamento do carrinho antes da limpeza                  |
| Mudanças na UI pública          | Seletores priorizam textos e atributos estáveis existentes |
