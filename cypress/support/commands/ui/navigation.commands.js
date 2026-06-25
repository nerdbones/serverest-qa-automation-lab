Cypress.Commands.add('obterPorName', (name) => {
  return cy.get(`[name="${name}"]`)
})

Cypress.Commands.add('obterPorTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('acessarTelaLogin', () => {
  cy.log('Acessando tela de login')
  cy.visit('/login')
})

Cypress.Commands.add('acessarTelaCadastroUsuario', () => {
  cy.log('Acessando tela de cadastro de usuário')
  cy.visit('/cadastrarusuarios')
})

Cypress.Commands.add('acessarTelaCadastroProduto', () => {
  cy.log('Acessando tela de cadastro de produto')
  cy.visit('/admin/cadastrarprodutos')
})
