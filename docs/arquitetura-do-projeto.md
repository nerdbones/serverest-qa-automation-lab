# Arquitetura do Projeto

## Visão geral

A estrutura foi desenhada para manter separação clara entre testes, dados, comandos customizados, configuração de execução e documentação.

```text
cypress/
├── e2e/
│   ├── api/
│   └── frontend/
├── fixtures/
└── support/
    ├── commands/
    │   ├── api/
    │   ├── evidence/
    │   └── ui/
    ├── data-factory.js
    └── e2e.js
```

## Diretório `cypress/e2e/api`

Contém cenários que exercitam diretamente a API ServeRest por meio de `cy.request`.

Responsabilidades:

- validar status HTTP;
- validar corpo das respostas;
- validar regras de negócio;
- validar autenticação e autorização;
- criar e limpar dados de apoio.

## Diretório `cypress/e2e/frontend`

Contém cenários E2E que interagem com a interface pública.

Responsabilidades:

- validar cadastro e login pela UI;
- validar navegação e redirecionamentos;
- validar cadastro administrativo de produtos;
- validar jornada de cliente com lista de compras.

## Diretório `cypress/support`

Centraliza comandos reutilizáveis, fábrica de dados e configuração global carregada antes dos testes.

Arquivos principais:

- `data-factory.js`: geração dinâmica de usuários, produtos e credenciais de teste.
- `e2e.js`: configuração global e importação dos commands por contexto.
- `commands/api/`: commands de criação, consulta, autenticação e limpeza via API.
- `commands/ui/`: commands de navegação e interação com a interface.
- `commands/evidence/`: commands auxiliares para rastreabilidade das etapas no log.

## Organização dos commands do Cypress

Os commands customizados foram organizados por contexto para facilitar manutenção, leitura e evolução do projeto.

```text
cypress/support/commands/
├── api/
│   ├── api.helpers.js
│   ├── auth.commands.js
│   ├── carts.commands.js
│   ├── products.commands.js
│   └── users.commands.js
├── evidence/
│   └── evidence.commands.js
└── ui/
    ├── auth.commands.js
    ├── carts.commands.js
    ├── navigation.commands.js
    ├── products.commands.js
    └── users.commands.js
```

A separação por contexto evita concentração excessiva de commands em um único arquivo e deixa mais clara a responsabilidade de cada ação:

- `api/`: ações de preparação, consulta, autenticação e limpeza de massa via API.
- `ui/`: ações de navegação e interação com a interface.
- `evidence/`: apoio à rastreabilidade das etapas executadas nos cenários.

## Estratégia de leitura dos cenários

Os cenários usam `describe` e `it` com nomes descritivos, além de registros de etapa com `cy.registrarEtapa()`.

Essa abordagem melhora a leitura do log de execução sem adicionar dependências extras de BDD/Cucumber ao projeto. Os textos dos cenários seguem uma narrativa próxima de Dado/Quando/Então, mas permanecem implementados com Cypress puro e JavaScript.

## Uso de `before` e `after`

Os blocos `before` são usados para preparar massa de dados e pré-condições antes da execução do cenário.

Os blocos `after` são usados para limpeza best-effort dos dados criados durante a execução. Essa estratégia reduz resíduos no ambiente compartilhado e mantém os cenários independentes, sem transformar a limpeza em uma nova fonte de falha desnecessária.

## Padrões adotados

- **Arrange, Act, Assert:** cada cenário organiza pré-condições, executa ação e valida resultado.
- **Pré-condições via API:** evita dependência manual e acelera testes de frontend.
- **Dados únicos:** reduz colisão em ambiente compartilhado.
- **Commands por contexto:** diminui duplicação e melhora legibilidade.
- **Logs de etapa:** tornam a execução mais rastreável no terminal e no CI.
- **Limpeza pós-teste:** remove dados criados sempre que a API permite.
