# Evidências

## Evidências locais

O Cypress gera evidências automaticamente durante a execução headless.

Diretórios principais:

```text
cypress/videos/
cypress/screenshots/
```

## Vídeos

Os vídeos são gerados para as specs executadas em modo headless. Eles ajudam a analisar a jornada executada, principalmente em falhas intermitentes.

## Screenshots

Screenshots são capturados automaticamente quando ocorre falha, pois a opção `screenshotOnRunFailure` está habilitada em `cypress.config.js`.

## Logs de terminal

A saída do Cypress no terminal exibe:

- specs executadas;
- testes aprovados e reprovados;
- tempo de execução;
- mensagens de erro;
- stack traces úteis para diagnóstico.

## Evidências no CI

No GitHub Actions, o workflow publica vídeos e screenshots como artefato chamado `cypress-evidences`.

Esse artefato permite análise posterior mesmo quando a execução ocorre fora da máquina local.

## Observação sobre relatórios externos

O projeto evita dependências adicionais de relatório para reduzir superfície de manutenção e manter o `npm audit` limpo. As evidências nativas do Cypress são suficientes para diagnóstico objetivo dos cenários automatizados.
