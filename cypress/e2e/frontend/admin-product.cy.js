import { buildProduct, buildUser } from '../../support/data-factory'

describe('Frontend - Gestão administrativa de produtos', () => {
  let admin
  let produto
  let adminToken
  let produtoCriado

  before(() => {
    produto = buildProduct({ nomePrefixo: 'Produto Front Admin' })

    cy.registrarEtapa('Preparando administrador para cadastro de produto via interface')
    cy.criarUsuarioApi(buildUser({ administrador: 'true', nomePrefixo: 'Admin Front' })).then(
      (createdAdmin) => {
        admin = createdAdmin
      }
    )

    cy.then(() => cy.autenticarUsuarioApi(admin, { validarSucesso: true })).then((response) => {
      adminToken = response.body.authorization
    })
  })

  after(() => {
    cy.registrarEtapa('Limpando produto e administrador criados durante o cenário')

    if (adminToken && produtoCriado?._id) {
      cy.excluirProdutoApi(adminToken, produtoCriado._id)
    } else if (adminToken && produto?.nome) {
      cy.consultarProdutosPorNomeApi(produto.nome).then((response) => {
        const produtoEncontrado = response.body.produtos?.[0]

        if (produtoEncontrado?._id) {
          cy.excluirProdutoApi(adminToken, produtoEncontrado._id)
        }
      })
    }

    if (admin?._id) {
      cy.excluirUsuarioApi(admin._id)
    }
  })

  it('deve autenticar administrador, cadastrar produto pela interface e exibi-lo na listagem', () => {
    cy.registrarEtapa('Dado que o administrador está autenticado na interface')
    cy.realizarLoginUi({ ...admin, perfilEsperado: 'admin' })

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
