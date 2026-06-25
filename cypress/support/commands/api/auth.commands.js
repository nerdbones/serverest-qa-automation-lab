import { obterApiUrl, validarStatus } from './api.helpers'

const requestLogin = ({ email, password }) => {
  return cy.request({
    method: 'POST',
    url: `${obterApiUrl()}/login`,
    body: { email, password },
    failOnStatusCode: false,
  })
}

const autenticarComRetentativa = (usuario, tentativasRestantes, intervaloMs) => {
  return requestLogin(usuario).then((response) => {
    if (response.status === 200 || tentativasRestantes <= 1) {
      return response
    }

    cy.log(
      `Autenticação ainda indisponível para ${usuario.email}. Nova tentativa em ${intervaloMs}ms.`
    )

    return cy
      .wait(intervaloMs, { log: false })
      .then(() => autenticarComRetentativa(usuario, tentativasRestantes - 1, intervaloMs))
  })
}

Cypress.Commands.add('autenticarUsuarioApi', ({ email, password }, options = {}) => {
  const { validarSucesso = false, tentativas = 5, intervaloMs = 1000 } = options

  const autenticar = validarSucesso
    ? autenticarComRetentativa({ email, password }, tentativas, intervaloMs)
    : requestLogin({ email, password })

  return autenticar.then((response) => {
    if (validarSucesso) {
      validarStatus(response, 200, `Autenticação do usuário ${email}`)
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(response.body)
        .to.have.property('authorization')
        .and.to.match(/^Bearer\s.+/)
    }

    return response
  })
})

Cypress.Commands.add('aguardarUsuarioAutenticavelApi', (usuario, options = {}) => {
  const { tentativas = 5, intervaloMs = 1000 } = options

  return autenticarComRetentativa(usuario, tentativas, intervaloMs).then((response) => {
    validarStatus(response, 200, `Disponibilidade de autenticação do usuário ${usuario.email}`)

    return response
  })
})
