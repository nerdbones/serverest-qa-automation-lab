Cypress.Commands.add('getByName', (name) => {
  return cy.get(`[name="${name}"]`)
})

Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('loginByUi', ({ email, password, perfilEsperado = 'cliente' }) => {
  cy.intercept('POST', '**/login').as('postLogin')

  cy.visit('/login')
  cy.getByTestId('email').clear().type(email)
  cy.getByTestId('senha').clear().type(password, { log: false })
  cy.getByTestId('entrar').click()

  cy.wait('@postLogin').its('response.statusCode').should('eq', 200)

  const rotaEsperada = perfilEsperado === 'admin' ? '/admin/home' : '/home'
  cy.location('pathname', { timeout: 12000 }).should('eq', rotaEsperada)
})

Cypress.Commands.add('registerClientByUi', ({ nome, email, password }) => {
  cy.intercept('POST', '**/usuarios').as('postUsuarios')
  cy.intercept('POST', '**/login').as('postLogin')

  cy.visit('/cadastrarusuarios')
  cy.contains('h2', /Cadastro/i).should('be.visible')

  cy.getByTestId('nome').clear().type(nome)
  cy.getByTestId('email').clear().type(email)
  cy.getByTestId('password').clear().type(password, { log: false })
  cy.getByTestId('cadastrar').click()

  cy.wait('@postUsuarios').its('response.statusCode').should('eq', 201)
  cy.wait('@postLogin', { timeout: 12000 }).its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/home')
})

Cypress.Commands.add('clearClientCartByUi', () => {
  cy.get('body').then(($body) => {
    const botaoLimpar = [...$body.find('button')].find((button) =>
      /Limpar Lista/i.test(button.innerText)
    )

    if (botaoLimpar) {
      cy.wrap(botaoLimpar).click()
    }
  })
})
