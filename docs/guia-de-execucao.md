# Guia de Execução

## Instalar dependências

```bash
npm ci
```

## Abrir Cypress em modo interativo

```bash
npm run cy:open
```

## Executar todos os testes

```bash
npm run cy:run
```

## Executar somente API

```bash
npm run cy:run:api
```

## Executar somente frontend

```bash
npm run cy:run:frontend
```

## Validar lint

```bash
npm run lint
```

## Validar formatação

```bash
npm run format:check
```

## Limpar evidências locais

```bash
npm run clean:artifacts
```

## Sobrescrever URLs padrão

```bash
CYPRESS_FRONTEND_URL=https://front.serverest.dev CYPRESS_API_URL=https://serverest.dev npm run cy:run
```

## Execução no GitHub Actions

O workflow é acionado em:

- push na branch `main`;
- pull request para `main`;
- execução manual via `workflow_dispatch`.

A execução no CI possui dois momentos:

1. validações estáticas e de segurança: `npm audit`, Prettier e ESLint;
2. execução paralelizada dos testes Cypress em dois grupos: API e frontend.

Ao final da execução, vídeos de falha e screenshots são publicados como artefatos quando existirem.
