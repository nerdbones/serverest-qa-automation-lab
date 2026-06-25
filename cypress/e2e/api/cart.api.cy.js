import { buildProduct, buildUser } from '../../support/data-factory'

describe('API - Produto e carrinho', () => {
  const usuariosCriados = []
  const produtosCriados = []
  const clienteTokens = []

  let admin
  let cliente
  let produto
  let adminToken
  let clienteToken
  let produtoCriado
  let carrinhoCriado

  beforeEach(() => {
    admin = undefined
    cliente = undefined
    produtoCriado = undefined
    carrinhoCriado = undefined
    adminToken = undefined
    clienteToken = undefined
    produto = buildProduct({ nomePrefixo: 'Produto Carrinho API' })

    cy.registrarEtapa('Preparando administrador para cadastro de produto')
    cy.criarUsuarioApi(buildUser({ administrador: 'true', nomePrefixo: 'Admin API' })).then(
      (createdAdmin) => {
        admin = createdAdmin
        usuariosCriados.push(createdAdmin)
      }
    )

    cy.then(() => cy.aguardarUsuarioAutenticavelApi(admin)).then((response) => {
      adminToken = response.body.authorization
    })

    cy.registrarEtapa('Preparando produto para uso no carrinho')
    cy.then(() => cy.criarProdutoApi(adminToken, produto)).then((createdProduct) => {
      produtoCriado = createdProduct
      produtosCriados.push(createdProduct)
    })

    cy.registrarEtapa('Preparando cliente para montagem do carrinho')
    cy.then(() => cy.criarUsuarioApi(buildUser({ nomePrefixo: 'Cliente API' }))).then(
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
    cy.registrarEtapa('Limpando carrinhos, produtos e usuários criados durante o cenário')

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

  it('deve criar produto como administrador, montar carrinho como cliente e cancelar compra', () => {
    cy.registrarEtapa('Quando o cliente cria um carrinho com o produto cadastrado')
    cy.criarCarrinhoApi(clienteToken, [{ idProduto: produtoCriado._id, quantidade: 2 }]).then(
      (cart) => {
        carrinhoCriado = cart
      }
    )

    cy.registrarEtapa(
      'Então o carrinho deve refletir produto, quantidade, preço e usuário corretos'
    )
    cy.then(() => cy.consultarCarrinhoPorIdApi(carrinhoCriado._id)).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.include({
        _id: carrinhoCriado._id,
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

    cy.registrarEtapa('E deve ser possível cancelar a compra com reabastecimento de estoque')
    cy.cancelarCarrinhoApi(clienteToken, { validarSucesso: true }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.contain('Registro excluído com sucesso')
    })
  })
})
