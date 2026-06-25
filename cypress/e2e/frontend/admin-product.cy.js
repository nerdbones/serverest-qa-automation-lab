import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Gestão administrativa de produtos', () => {
  let admin
  let adminToken
  let produtoCriado

  after(() => {
    if (adminToken && produtoCriado?._id) {
      cy.apiDeleteProduct(adminToken, produtoCriado._id)
    }

    if (admin?._id) {
      cy.apiDeleteUser(admin._id)
    }
  })

  it('deve autenticar administrador, cadastrar produto pela interface e exibi-lo na listagem', () => {
    const produto = buildProduct({ nomePrefixo: 'Produto Front Admin' })

    cy.apiCreateUser(buildUser({ administrador: 'true', nomePrefixo: 'Admin Front' })).then(
      (createdAdmin) => {
        admin = createdAdmin
      }
    )

    cy.then(() => cy.apiLogin(admin)).then((response) => {
      expect(response.status).to.eq(200)
      adminToken = response.body.authorization
    })

    cy.then(() => {
      cy.loginByUi({ ...admin, perfilEsperado: 'admin' })
    })

    cy.visit('/admin/cadastrarprodutos')
    cy.contains('h1', /Cadastro de Produtos/i).should('be.visible')

    cy.getByTestId('nome').clear().type(produto.nome)
    cy.getByTestId('preco').clear().type(`${produto.preco}`)
    cy.getByTestId('descricao').clear().type(produto.descricao)
    cy.getByTestId('quantity').clear().type(`${produto.quantidade}`)
    cy.getByTestId('cadastarProdutos').click()

    cy.location('pathname', { timeout: 10000 }).should('eq', '/admin/listarprodutos')
    cy.contains('h1', /Lista dos Produtos/i).should('be.visible')
    cy.contains('td', produto.nome).should('be.visible')
    cy.contains('td', `${produto.preco}`).should('be.visible')
    cy.contains('td', produto.descricao).should('be.visible')

    cy.apiGetProductsByName(produto.nome).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
      produtoCriado = response.body.produtos[0]
    })
  })
})
