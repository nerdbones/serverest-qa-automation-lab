import { obterApiUrl, validarStatus } from './api.helpers'

Cypress.Commands.add('autenticarUsuarioApi', ({ email, password }, options = {}) => {
  const { validarSucesso = false } = options

  return cy
    .request({
      method: 'POST',
      url: `${obterApiUrl()}/login`,
      body: { email, password },
      failOnStatusCode: false,
    })
    .then((response) => {
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
