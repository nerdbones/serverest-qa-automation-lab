Cypress.Commands.add('preencherLogin', ({ email, password }) => {
  cy.log(`Preenchendo login para o usuário ${email}`)

  cy.obterPorTestId('email').clear().type(email)
  cy.obterPorTestId('senha').clear().type(password, { log: false })
})

Cypress.Commands.add('submeterLogin', () => {
  cy.log('Submetendo formulário de login')
  cy.obterPorTestId('entrar').click()
})

const tentarLoginUi = (usuario, tentativasRestantes, intervaloMs) => {
  cy.acessarTelaLogin()
  cy.preencherLogin(usuario)
  cy.submeterLogin()

  return cy.wait('@postLogin').then((interception) => {
    const statusCode = interception.response?.statusCode

    if (statusCode === 200 || tentativasRestantes <= 1) {
      return cy.wrap(interception, { log: false })
    }

    cy.log(
      `Login pela interface retornou ${statusCode}. Nova tentativa em ${intervaloMs}ms para ${usuario.email}.`
    )

    return cy
      .wait(intervaloMs, { log: false })
      .then(() => tentarLoginUi(usuario, tentativasRestantes - 1, intervaloMs))
  })
}

Cypress.Commands.add('realizarLoginUi', (usuario) => {
  const { email, perfilEsperado = 'cliente' } = usuario
  const tentativas = usuario.tentativas ?? 4
  const intervaloMs = usuario.intervaloMs ?? 1000

  cy.log(`Realizando login pela interface como ${perfilEsperado}`)
  cy.intercept('POST', '**/login').as('postLogin')

  tentarLoginUi(usuario, tentativas, intervaloMs).then((interception) => {
    const statusCode = interception.response?.statusCode
    const responseBody = JSON.stringify(interception.response?.body)

    expect(statusCode, `Login pela interface para ${email} | resposta: ${responseBody}`).to.eq(200)

    const rotaEsperada = perfilEsperado === 'admin' ? '/admin/home' : '/home'
    cy.location('pathname', { timeout: 12000 }).should('eq', rotaEsperada)
  })
})
