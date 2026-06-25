import { montarHeadersAutenticados, obterApiUrl, validarStatus } from './api.helpers'

Cypress.Commands.add('criarProdutoApi', (authorization, produto) => {
  return cy
    .request({
      method: 'POST',
      url: `${obterApiUrl()}/produtos`,
      headers: montarHeadersAutenticados(authorization),
      body: produto,
      failOnStatusCode: false,
    })
    .then((response) => {
      validarStatus(response, 201, `Cadastro de produto ${produto.nome}`)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string')

      return {
        ...produto,
        _id: response.body._id,
      }
    })
})

Cypress.Commands.add('consultarProdutosPorNomeApi', (productName) => {
  return cy.request({
    method: 'GET',
    url: `${obterApiUrl()}/produtos`,
    qs: { nome: productName },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('excluirProdutoApi', (authorization, productId) => {
  if (!authorization || !productId) return cy.wrap(null, { log: false })

  return cy.request({
    method: 'DELETE',
    url: `${obterApiUrl()}/produtos/${productId}`,
    headers: montarHeadersAutenticados(authorization),
    failOnStatusCode: false,
  })
})
