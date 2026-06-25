import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Jornada de cliente com lista de compras', () => {
  let admin
  let cliente
  let produto
  let adminToken
  let clienteToken
  let produtoCriado

  before(() => {
    produto = buildProduct({ nomePrefixo: 'Produto Front Cliente' })

    cy.registrarEtapa('Preparando administrador e produto para jornada do cliente')
    cy.criarUsuarioApi(buildUser({ administrador: 'true', nomePrefixo: 'Admin Jornada' })).then(
      (createdAdmin) => {
        admin = createdAdmin
      }
    )

    cy.then(() => cy.autenticarUsuarioApi(admin, { validarSucesso: true })).then((response) => {
      adminToken = response.body.authorization
    })

    cy.then(() => cy.criarProdutoApi(adminToken, produto)).then((createdProduct) => {
      produtoCriado = createdProduct
    })

    cy.registrarEtapa('Preparando cliente para jornada de lista de compras')
    cy.then(() => cy.criarUsuarioApi(buildUser({ nomePrefixo: 'Cliente Jornada' }))).then(
      (createdClient) => {
        cliente = createdClient
      }
    )

    cy.then(() => cy.autenticarUsuarioApi(cliente, { validarSucesso: true })).then((response) => {
      clienteToken = response.body.authorization
    })
  })

  after(() => {
    cy.registrarEtapa('Limpando lista, produto e usuários criados durante o cenário')

    if (clienteToken) {
      cy.cancelarCarrinhoApi(clienteToken, { validarSucesso: false })
    }

    if (adminToken && produtoCriado?._id) {
      cy.excluirProdutoApi(adminToken, produtoCriado._id)
    }

    if (cliente?._id) {
      cy.excluirUsuarioApi(cliente._id)
    }

    if (admin?._id) {
      cy.excluirUsuarioApi(admin._id)
    }
  })

  it('deve permitir que cliente encontre um produto e adicione-o à lista de compras', () => {
    cy.registrarEtapa('Dado que o cliente está autenticado na loja')
    cy.realizarLoginUi({ ...cliente, perfilEsperado: 'cliente' })

    cy.registrarEtapa('Quando o cliente pesquisa o produto cadastrado')
    cy.contains('h1', /Serverest Store/i).should('be.visible')
    cy.pesquisarProdutoUi(produto.nome)

    cy.registrarEtapa('E adiciona o produto à lista de compras')
    cy.adicionarPrimeiroProdutoNaListaDeCompras()

    cy.registrarEtapa('Então a lista de compras deve exibir o produto escolhido')
    cy.validarProdutoNaListaDeCompras(produto)

    cy.registrarEtapa('E deve ser possível limpar a lista de compras')
    cy.limparListaDeCompras()
  })
})
