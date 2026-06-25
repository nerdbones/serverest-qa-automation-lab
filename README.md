# Serverest QA Automation Lab

[![Cypress Quality Pipeline](https://github.com/nerdbones/serverest-qa-automation-lab/actions/workflows/cypress.yml/badge.svg)](https://github.com/nerdbones/serverest-qa-automation-lab/actions/workflows/cypress.yml)
[![API ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)
[![Cypress](https://img.shields.io/badge/Testes-Cypress-17202C)](https://www.cypress.io/)
[![JavaScript](https://img.shields.io/badge/Linguagem-JavaScript-yellow)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

Este projeto visa demonstrar uma abordagem estruturada de automação de testes E2E e API com **Cypress** e **JavaScript**, usando a aplicação pública ServeRest como sistema sob teste.

O objetivo é apresentar uma base de automação legível, escalável e próxima de um cenário real de QA, cobrindo fluxos críticos de cadastro, autenticação, gestão de produtos e jornada de cliente em uma loja virtual demonstrativa.

## Aplicação sob teste

- Frontend: `https://front.serverest.dev`
- API/Swagger: `https://serverest.dev`

O ServeRest simula uma loja virtual e disponibiliza recursos de usuários, autenticação, produtos e carrinhos. O frontend público possui telas de login, cadastro, área administrativa, produtos e lista de compras.

## Escopo automatizado

### Frontend E2E

- Cadastro de cliente pela interface e redirecionamento para a área logada.
- Login de administrador, cadastro de produto pela interface e validação na listagem.
- Login de cliente, busca de produto e inclusão na lista de compras.

### API

- Cadastro de usuário, consulta por e-mail e validação de duplicidade.
- Autenticação positiva e negativa.
- Criação de produto, criação de carrinho, validação do carrinho e cancelamento da compra.

## Tecnologias utilizadas

- Cypress
- JavaScript
- Node.js
- Faker
- ESLint
- Prettier
- GitHub Actions

## Decisão sobre ambiente de CI

O pipeline utiliza `ubuntu-24.04` por simplicidade, previsibilidade e compatibilidade com GitHub Actions. Para suítes maiores ou ambientes com necessidade de maior controle de browsers e dependências, o projeto pode evoluir para execução em imagens Docker oficiais do Cypress, como `cypress/included` ou `cypress/browsers`.

## Pré-requisitos

- Node.js 22 ou superior compatível.
- NPM.
- Git.
- Acesso à internet para consumir os ambientes públicos do ServeRest.

Este projeto inclui o arquivo `.nvmrc`, então, usando `nvm`, basta executar:

```bash
nvm use
```

## Instalação

```bash
npm ci
```

## Execução dos testes

Executar todos os testes:

```bash
npm run cy:run
```

Executar somente os testes de API:

```bash
npm run cy:run:api
```

Executar somente os testes de frontend:

```bash
npm run cy:run:frontend
```

Abrir o Cypress em modo interativo:

```bash
npm run cy:open
```

## Qualidade estática

Validar lint:

```bash
npm run lint
```

Validar formatação:

```bash
npm run format:check
```

Formatar arquivos:

```bash
npm run format
```

## Configuração de ambientes

Por padrão, o projeto executa contra os ambientes públicos:

```text
Frontend: https://front.serverest.dev
API:      https://serverest.dev
```

Também é possível sobrescrever os endereços por variáveis de ambiente:

```bash
CYPRESS_FRONTEND_URL=https://front.serverest.dev CYPRESS_API_URL=https://serverest.dev npm run cy:run
```

## Estrutura do projeto

```text
serverest-qa-automation-lab/
├── .github/workflows/         # Pipeline de CI com GitHub Actions
├── cypress/e2e/api/           # Cenários automatizados de API
├── cypress/e2e/frontend/      # Cenários automatizados E2E de frontend
├── cypress/fixtures/          # Dados estáticos de apoio
├── cypress/support/           # Commands por contexto, configuração global e massa dinâmica
├── docs/                      # Documentação complementar do projeto
├── cypress.config.js          # Configuração principal do Cypress
├── eslint.config.js           # Configuração de análise estática
├── package.json               # Scripts e dependências
└── README.md                  # Visão geral do projeto
```

## Documentação complementar

A documentação detalhada está organizada no diretório `docs/`:

- [`docs/estrategia-de-testes.md`](docs/estrategia-de-testes.md): visão geral da estratégia de qualidade adotada.
- [`docs/arquitetura-do-projeto.md`](docs/arquitetura-do-projeto.md): explicação da estrutura, padrões e responsabilidades dos arquivos.
- [`docs/plano-de-testes.md`](docs/plano-de-testes.md): escopo, premissas, riscos e critérios de entrada/saída.
- [`docs/cenarios-de-teste.md`](docs/cenarios-de-teste.md): cenários funcionais cobertos por frontend e API.
- [`docs/guia-de-execucao.md`](docs/guia-de-execucao.md): instruções para execução local e em pipeline.
- [`docs/evidencias.md`](docs/evidencias.md): evidências geradas e como interpretá-las.

## Evidências

O projeto usa os recursos nativos do Cypress para gerar evidências:

- vídeos apenas em falhas de specs;
- screenshots automáticos em falha;
- logs detalhados no terminal, incluindo etapas dos cenários;
- artefatos separados por camada no GitHub Actions.

## CI/CD

O workflow `.github/workflows/cypress.yml` executa:

1. instalação das dependências com `npm ci`;
2. validação de formatação;
3. validação estática com ESLint;
4. execução paralelizada dos testes Cypress por camada: API e frontend;
5. publicação de vídeos de falha e screenshots como artefatos.

## Decisões de qualidade

- Massa de dados dinâmica para reduzir colisões no ambiente compartilhado.
- Separação entre testes de API e frontend.
- Commands customizados organizados por contexto para reduzir duplicação e melhorar manutenção.
- Assertivas explícitas para status HTTP, mensagens, dados persistidos e redirecionamentos.
- Uso de `before` para preparação de massa e `after` para limpeza best-effort dos dados criados.
- Ausência de dependências de relatório vulneráveis ou desnecessárias.

## Observações

Os ambientes públicos do ServeRest são compartilhados com outros usuários. Por isso, os testes foram desenhados com dados únicos e independentes por execução.
