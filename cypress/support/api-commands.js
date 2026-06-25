const apiUrl = () => Cypress.expose('apiUrl')

const validarStatus = (response, statusEsperado, contexto) => {
  expect(response.status, `${contexto} | resposta: ${JSON.stringify(response.body)}`).to.eq(
    statusEsperado
  )
}

Cypress.Commands.add('apiCreateUser', (usuario) => {
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl()}/usuarios`,
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

Cypress.Commands.add('apiDeleteUser', (userId) => {
  if (!userId) return cy.wrap(null)

  return cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/usuarios/${userId}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiLogin', ({ email, password }) => {
  return cy.request({
    method: 'POST',
    url: `${apiUrl()}/login`,
    body: { email, password },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiCreateProduct', (authorization, produto) => {
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl()}/produtos`,
      headers: { Authorization: authorization },
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

Cypress.Commands.add('apiDeleteProduct', (authorization, productId) => {
  if (!authorization || !productId) return cy.wrap(null)

  return cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/produtos/${productId}`,
    headers: { Authorization: authorization },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiGetProductsByName', (productName) => {
  return cy.request({
    method: 'GET',
    url: `${apiUrl()}/produtos`,
    qs: { nome: productName },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiCreateCart', (authorization, produtos) => {
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl()}/carrinhos`,
      headers: { Authorization: authorization },
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

Cypress.Commands.add('apiGetCartById', (cartId) => {
  return cy.request({
    method: 'GET',
    url: `${apiUrl()}/carrinhos/${cartId}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiCancelCart', (authorization) => {
  if (!authorization) return cy.wrap(null)

  return cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/carrinhos/cancelar-compra`,
    headers: { Authorization: authorization },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiUrl', () => {
  return cy.wrap(apiUrl(), { log: false })
})
