# Arquitetura do Projeto

## Visão geral

A estrutura foi desenhada para manter separação clara entre testes, dados, comandos customizados e documentação.

```text
cypress/
├── e2e/
│   ├── api/
│   └── frontend/
├── fixtures/
└── support/
```

## Diretório `cypress/e2e/api`

Contém cenários que exercitam diretamente a API ServeRest por meio de `cy.request`.

Responsabilidades:

- validar status HTTP;
- validar corpo das respostas;
- validar regras de negócio;
- criar e limpar dados de apoio.

## Diretório `cypress/e2e/frontend`

Contém cenários E2E que interagem com a interface pública.

Responsabilidades:

- validar cadastro e login pela UI;
- validar navegação e redirecionamentos;
- validar cadastro administrativo de produtos;
- validar jornada de cliente com lista de compras.

## Diretório `cypress/support`

Centraliza comandos reutilizáveis e fábrica de dados.

Arquivos principais:

- `commands.js`: comandos de interação com a interface.
- `api-commands.js`: comandos para criação, consulta e limpeza de dados via API.
- `data-factory.js`: geração de usuários, produtos e credenciais de teste.
- `e2e.js`: configuração global carregada antes dos testes.

## Padrões adotados

- **Arrange, Act, Assert:** cada cenário organiza pré-condições, executa ação e valida resultado.
- **Pré-condições via API:** evita dependência manual e acelera testes de frontend.
- **Dados únicos:** reduz colisão em ambiente compartilhado.
- **Comandos customizados:** diminui duplicação e melhora legibilidade.
- **Limpeza pós-teste:** remove dados criados sempre que a API permite.
