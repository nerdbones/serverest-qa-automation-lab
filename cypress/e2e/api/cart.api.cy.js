import { buildProduct, buildUser } from '../../support/data-factory'

describe('API - Produto e carrinho', () => {
  let admin
  let cliente
  let adminToken
  let clienteToken
  let produtoCriado
  let carrinhoId

  after(() => {
    if (clienteToken) {
      cy.apiCancelCart(clienteToken)
    }

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

  it('deve criar produto como administrador, montar carrinho como cliente e cancelar compra', () => {
    const produto = buildProduct({ nomePrefixo: 'Produto Carrinho API' })

    cy.apiCreateUser(buildUser({ administrador: 'true', nomePrefixo: 'Admin API' })).then(
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

    cy.then(() => cy.apiCreateUser(buildUser({ nomePrefixo: 'Cliente API' }))).then(
      (createdClient) => {
        cliente = createdClient
      }
    )

    cy.then(() => cy.apiLogin(cliente)).then((response) => {
      expect(response.status).to.eq(200)
      clienteToken = response.body.authorization
    })

    cy.then(() =>
      cy.apiCreateCart(clienteToken, [{ idProduto: produtoCriado._id, quantidade: 2 }])
    ).then((cart) => {
      carrinhoId = cart._id
    })

    cy.then(() => cy.apiGetCartById(carrinhoId)).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.include({
        _id: carrinhoId,
        idUsuario: cliente._id,
        precoTotal: produtoCriado.preco * 2,
        quantidadeTotal: 2,
      })
      expect(response.body.produtos).to.have.length(1)
      expect(response.body.produtos[0]).to.include({
        idProduto: produtoCriado._id,
        quantidade: 2,
        precoUnitario: produtoCriado.preco,
      })
    })

    cy.then(() => cy.apiCancelCart(clienteToken)).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.contain('Registro excluído com sucesso')
    })
  })
})
