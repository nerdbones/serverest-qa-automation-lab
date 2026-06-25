import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Gestão administrativa de produtos', () => {
  const adminsCriados = []
  const nomesProdutosGerados = []

  let admin
  let produto
  let adminToken
  let produtoCriado

  beforeEach(() => {
    admin = undefined
    produtoCriado = undefined
    adminToken = undefined
    produto = buildProduct({ nomePrefixo: 'Produto Front Admin' })
    nomesProdutosGerados.push(produto.nome)

    cy.registrarEtapa('Preparando administrador para cadastro de produto via interface')
    cy.criarUsuarioApi(buildUser({ administrador: 'true', nomePrefixo: 'Admin Front' })).then(
      (createdAdmin) => {
        admin = createdAdmin
        adminsCriados.push(createdAdmin)
      }
    )

    cy.then(() => cy.aguardarUsuarioAutenticavelApi(admin)).then((response) => {
      adminToken = response.body.authorization
    })
  })

  after(() => {
    cy.registrarEtapa('Limpando produtos e administradores criados durante o cenário')

    cy.wrap(nomesProdutosGerados, { log: false }).each((nomeProduto) => {
      if (adminToken && nomeProduto) {
        cy.consultarProdutosPorNomeApi(nomeProduto).then((response) => {
          const produtoEncontrado = response.body.produtos?.[0]

          if (produtoEncontrado?._id) {
            cy.excluirProdutoApi(adminToken, produtoEncontrado._id)
          }
        })
      }
    })

    cy.wrap(adminsCriados, { log: false }).each((adminCriado) => {
      if (adminCriado?._id) {
        cy.excluirUsuarioApi(adminCriado._id)
      }
    })
  })

  it('deve autenticar administrador, cadastrar produto pela interface e exibi-lo na listagem', () => {
    cy.registrarEtapa('Dado que o administrador está autenticado na interface')
    cy.realizarLoginUi({ ...admin, perfilEsperado: 'admin', tentativas: 6, intervaloMs: 1500 })

    cy.registrarEtapa('Quando o administrador cadastra um novo produto')
    cy.cadastrarProdutoUi(produto)

    cy.registrarEtapa('Então o produto deve ser exibido na listagem administrativa')
    cy.validarProdutoNaListagemAdministrativa(produto)

    cy.registrarEtapa('E o produto deve existir na API')
    cy.consultarProdutosPorNomeApi(produto.nome).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
      produtoCriado = response.body.produtos[0]
    })
  })
})
