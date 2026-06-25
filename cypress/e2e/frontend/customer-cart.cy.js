import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Jornada de cliente com lista de compras', () => {
  const usuariosCriados = []
  const produtosCriados = []
  const clienteTokens = []

  let admin
  let cliente
  let produto
  let adminToken
  let clienteToken
  let produtoCriado

  beforeEach(() => {
    admin = undefined
    cliente = undefined
    produtoCriado = undefined
    adminToken = undefined
    clienteToken = undefined
    produto = buildProduct({ nomePrefixo: 'Produto Front Cliente' })

    cy.registrarEtapa('Preparando administrador e produto para jornada do cliente')
    cy.criarUsuarioApi(buildUser({ administrador: 'true', nomePrefixo: 'Admin Jornada' })).then(
      (createdAdmin) => {
        admin = createdAdmin
        usuariosCriados.push(createdAdmin)
      }
    )

    cy.then(() => cy.aguardarUsuarioAutenticavelApi(admin)).then((response) => {
      adminToken = response.body.authorization
    })

    cy.then(() => cy.criarProdutoApi(adminToken, produto)).then((createdProduct) => {
      produtoCriado = createdProduct
      produtosCriados.push(createdProduct)
    })

    cy.registrarEtapa('Preparando cliente para jornada de lista de compras')
    cy.then(() => cy.criarUsuarioApi(buildUser({ nomePrefixo: 'Cliente Jornada' }))).then(
      (createdClient) => {
        cliente = createdClient
        usuariosCriados.push(createdClient)
      }
    )

    cy.then(() => cy.aguardarUsuarioAutenticavelApi(cliente)).then((response) => {
      clienteToken = response.body.authorization
      clienteTokens.push(clienteToken)
    })
  })

  after(() => {
    cy.registrarEtapa('Limpando listas, produtos e usuários criados durante o cenário')

    cy.wrap(clienteTokens, { log: false }).each((token) => {
      if (token) {
        cy.cancelarCarrinhoApi(token, { validarSucesso: false })
      }
    })

    cy.wrap(produtosCriados, { log: false }).each((produtoParaExcluir) => {
      if (adminToken && produtoParaExcluir?._id) {
        cy.excluirProdutoApi(adminToken, produtoParaExcluir._id)
      }
    })

    cy.wrap(usuariosCriados, { log: false }).each((usuarioCriado) => {
      if (usuarioCriado?._id) {
        cy.excluirUsuarioApi(usuarioCriado._id)
      }
    })
  })

  it('deve permitir que cliente encontre um produto e adicione-o à lista de compras', () => {
    cy.registrarEtapa('Dado que o cliente está autenticado na loja')
    cy.realizarLoginUi({ ...cliente, perfilEsperado: 'cliente', tentativas: 6, intervaloMs: 1500 })

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
