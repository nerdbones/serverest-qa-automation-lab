Cypress.Commands.add('preencherLogin', ({ email, password }) => {
  cy.log(`Preenchendo login para o usuário ${email}`)

  cy.obterPorTestId('email').clear().type(email)
  cy.obterPorTestId('senha').clear().type(password, { log: false })
})

Cypress.Commands.add('submeterLogin', () => {
  cy.log('Submetendo formulário de login')
  cy.obterPorTestId('entrar').click()
})

Cypress.Commands.add('realizarLoginUi', ({ email, password, perfilEsperado = 'cliente' }) => {
  cy.log(`Realizando login pela interface como ${perfilEsperado}`)

  cy.intercept('POST', '**/login').as('postLogin')

  cy.acessarTelaLogin()
  cy.preencherLogin({ email, password })
  cy.submeterLogin()

  cy.wait('@postLogin').its('response.statusCode').should('eq', 200)

  const rotaEsperada = perfilEsperado === 'admin' ? '/admin/home' : '/home'
  cy.location('pathname', { timeout: 12000 }).should('eq', rotaEsperada)
})
