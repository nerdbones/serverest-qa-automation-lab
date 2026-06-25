Cypress.Commands.add('preencherCadastroUsuario', ({ nome, email, password }) => {
  cy.log(`Preenchendo cadastro do usuário ${email}`)

  cy.obterPorTestId('nome').clear().type(nome)
  cy.obterPorTestId('email').clear().type(email)
  cy.obterPorTestId('password').clear().type(password, { log: false })
})

Cypress.Commands.add('submeterCadastroUsuario', () => {
  cy.log('Submetendo formulário de cadastro de usuário')
  cy.obterPorTestId('cadastrar').click()
})

Cypress.Commands.add('cadastrarClienteUi', (usuario) => {
  cy.log('Cadastrando cliente pela interface')

  cy.intercept('POST', '**/usuarios').as('postUsuarios')
  cy.intercept('POST', '**/login').as('postLogin')

  cy.acessarTelaCadastroUsuario()
  cy.contains('h2', /Cadastro/i).should('be.visible')

  cy.preencherCadastroUsuario(usuario)
  cy.submeterCadastroUsuario()

  cy.wait('@postUsuarios').its('response.statusCode').should('eq', 201)
  cy.wait('@postLogin', { timeout: 12000 }).its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/home')
})
