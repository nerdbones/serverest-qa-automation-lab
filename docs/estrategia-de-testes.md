# Estratégia de Testes

## Objetivo

Este projeto cobre fluxos críticos de uma aplicação demonstrativa de loja virtual, combinando testes E2E de frontend e testes de API.

A estratégia prioriza validações com valor funcional claro: criação de usuários, autenticação, gestão de produtos e jornada de cliente com lista de compras.

## Abordagem

A automação foi separada em duas camadas:

- **API:** valida regras de negócio, contratos básicos de resposta, status HTTP, mensagens e persistência dos dados.
- **Frontend E2E:** valida a integração entre interface, backend, autenticação, navegação e experiência do usuário.

## Critérios usados para escolha dos cenários

Os cenários foram escolhidos com base em:

- criticidade para a jornada de loja virtual;
- presença de regras de negócio relevantes;
- necessidade de autenticação e perfis distintos;
- possibilidade de validar fluxos positivos e alternativos;
- independência entre execuções.

## Boas práticas aplicadas

- Dados gerados dinamicamente com Faker.
- Isolamento entre cenários.
- Criação de pré-condições via API para acelerar testes de frontend.
- Uso de `before` para preparação controlada de massa.
- Uso de `after` para limpeza best-effort dos dados criados.
- Assertivas explícitas e legíveis.
- Organização por domínio técnico: `api` e `frontend`.
- Commands customizados separados por contexto: API, UI e evidência.
- Logs de etapa para melhorar rastreabilidade no terminal e no CI.
- Pipeline com validações estáticas, execução paralelizada por camada e publicação de evidências.

## Riscos conhecidos

A aplicação sob teste usa ambientes públicos e compartilhados. Portanto, podem ocorrer instabilidades externas, indisponibilidade temporária ou interferência de dados criados por terceiros.

Para mitigar esse risco, os testes utilizam dados únicos por execução e evitam depender de dados previamente existentes.
