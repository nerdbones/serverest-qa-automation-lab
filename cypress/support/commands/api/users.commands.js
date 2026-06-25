import { obterApiUrl, validarStatus } from './api.helpers'

Cypress.Commands.add('criarUsuarioApi', (usuario) => {
  return cy
    .request({
      method: 'POST',
      url: `${obterApiUrl()}/usuarios`,
      body: usuario,
      failOnStatusCode: false,
    })
    .then((response) => {
      validarStatus(response, 201, `Cadastro de usuário ${usuario.email}`)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string')

      return {
        ...usuario,
        _id: response.body._id,
      }
    })
})

Cypress.Commands.add('consultarUsuariosPorEmailApi', (email) => {
  return cy.request({
    method: 'GET',
    url: `${obterApiUrl()}/usuarios`,
    qs: { email },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('excluirUsuarioApi', (userId) => {
  if (!userId) return cy.wrap(null, { log: false })

  return cy.request({
    method: 'DELETE',
    url: `${obterApiUrl()}/usuarios/${userId}`,
    failOnStatusCode: false,
  })
})
