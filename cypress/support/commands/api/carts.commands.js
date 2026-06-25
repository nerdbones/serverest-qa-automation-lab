import { montarHeadersAutenticados, obterApiUrl, validarStatus } from './api.helpers'

Cypress.Commands.add('criarCarrinhoApi', (authorization, produtos) => {
  return cy
    .request({
      method: 'POST',
      url: `${obterApiUrl()}/carrinhos`,
      headers: montarHeadersAutenticados(authorization),
      body: { produtos },
      failOnStatusCode: false,
    })
    .then((response) => {
      validarStatus(response, 201, 'Cadastro de carrinho')
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string')

      return response.body
    })
})

Cypress.Commands.add('consultarCarrinhoPorIdApi', (cartId) => {
  return cy.request({
    method: 'GET',
    url: `${obterApiUrl()}/carrinhos/${cartId}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('cancelarCarrinhoApi', (authorization, options = {}) => {
  const { validarSucesso = false } = options

  if (!authorization) return cy.wrap(null, { log: false })

  return cy
    .request({
      method: 'DELETE',
      url: `${obterApiUrl()}/carrinhos/cancelar-compra`,
      headers: montarHeadersAutenticados(authorization),
      failOnStatusCode: false,
    })
    .then((response) => {
      if (validarSucesso) {
        validarStatus(response, 200, 'Cancelamento de carrinho')
        expect(response.body.message).to.contain('Registro excluído com sucesso')
      }

      return response
    })
})
