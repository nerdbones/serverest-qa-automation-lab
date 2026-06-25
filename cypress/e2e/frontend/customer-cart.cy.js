import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Jornada de cliente com lista de compras', () => {
  let admin
  let cliente
  let adminToken
  let produtoCriado

  after(() => {
    if (adminToken && produtoCriado?._id) {
      cy.apiDeleteProduct(adminToken, produtoCriado._id)
    }

    if (cliente?._id) {
      cy.apiDeleteUser(cliente._id)
    }

    if (admin?._id) {
      cy.apiDeleteUser(admin._id)
    }
  })

  it('deve permitir que cliente encontre um produto e adicione-o à lista de compras', () => {
    const produto = buildProduct({ nomePrefixo: 'Produto Front Cliente' })

    cy.apiCreateUser(buildUser({ administrador: 'true', nomePrefixo: 'Admin Jornada' })).then(
      (createdAdmin) => {
        admin = createdAdmin
      }
    )

    cy.then(() => cy.apiLogin(admin)).then((response) => {
      expect(response.status).to.eq(200)
      adminToken = response.body.authorization
    })

    cy.then(() => cy.apiCreateProduct(adminToken, produto)).then((createdProduct) => {
      produtoCriado = createdProduct
    })

    cy.then(() => cy.apiCreateUser(buildUser({ nomePrefixo: 'Cliente Jornada' }))).then(
      (createdClient) => {
        cliente = createdClient
      }
    )

    cy.then(() => {
      cy.loginByUi({ ...cliente, perfilEsperado: 'cliente' })
    })

    cy.contains('h1', /Serverest Store/i).should('be.visible')
    cy.getByTestId('pesquisar').clear().type(produto.nome)
    cy.getByTestId('botaoPesquisar').click()
    cy.contains(produto.nome, { timeout: 10000 }).should('be.visible')

    cy.getByTestId('adicionarNaLista').first().click()

    cy.contains('h1', /Lista de Compras/i, { timeout: 10000 }).should('be.visible')
    cy.getByTestId('shopping-cart-product-name').should('contain.text', produto.nome)
    cy.contains(`Preço R$${produto.preco}`).should('be.visible')
    cy.getByTestId('limparLista').click()
    cy.contains(/Seu carrinho está vazio/i).should('be.visible')
  })
})
