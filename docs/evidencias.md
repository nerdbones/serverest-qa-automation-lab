# Evidências

## Evidências locais

O Cypress gera evidências automaticamente durante a execução headless.

Diretórios principais:

```text
cypress/videos/
cypress/screenshots/
```

## Vídeos

Os vídeos são habilitados no Cypress, mas o projeto remove automaticamente os vídeos das specs que passam sem falha.

Com isso, vídeos ficam disponíveis apenas quando existe falha, reduzindo ruído, tamanho dos artefatos e custo de análise.

## Screenshots

Screenshots são capturados automaticamente quando ocorre falha, pois a opção `screenshotOnRunFailure` está habilitada em `cypress.config.js`.

## Logs de terminal

A saída do Cypress no terminal exibe:

- specs executadas;
- testes aprovados e reprovados;
- etapas registradas com `cy.registrarEtapa()`;
- tempo de execução;
- mensagens de erro;
- stack traces úteis para diagnóstico.

## Evidências no CI

No GitHub Actions, o workflow publica vídeos e screenshots como artefatos quando existirem.

Como os testes de API e frontend rodam em jobs separados, os artefatos também são separados:

- `evidencias-cypress-api`;
- `evidencias-cypress-frontend`.

Essa separação facilita a análise quando uma falha acontece em apenas uma camada da automação.

## Observação sobre relatórios externos

O projeto evita dependências adicionais de relatório para reduzir superfície de manutenção e manter o `npm audit` limpo. As evidências nativas do Cypress são suficientes para diagnóstico objetivo dos cenários automatizados.
