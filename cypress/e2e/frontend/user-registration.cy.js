import { buildUser } from '../../support/data-factory'

describe('Frontend - Cadastro de cliente', () => {
  let usuario
  let usuarioCriado

  before(() => {
    usuario = buildUser({ nomePrefixo: 'Cliente Front' })
  })

  after(() => {
    cy.registrarEtapa('Limpando cliente cadastrado durante o cenário')

    if (usuarioCriado?._id) {
      cy.excluirUsuarioApi(usuarioCriado._id)
    } else if (usuario?.email) {
      cy.consultarUsuariosPorEmailApi(usuario.email).then((response) => {
        const usuarioEncontrado = response.body.usuarios?.[0]

        if (usuarioEncontrado?._id) {
          cy.excluirUsuarioApi(usuarioEncontrado._id)
        }
      })
    }
  })

  it('deve cadastrar cliente pela interface e redirecionar para a área logada', () => {
    cy.registrarEtapa('Dado que o visitante acessa o cadastro público de usuários')
    cy.cadastrarClienteUi(usuario)

    cy.registrarEtapa('Então o usuário deve existir na API com perfil de cliente')
    cy.consultarUsuariosPorEmailApi(usuario.email).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
      expect(response.body.usuarios[0]).to.include({
        nome: usuario.nome,
        email: usuario.email,
        administrador: 'false',
      })

      usuarioCriado = response.body.usuarios[0]
    })

    cy.registrarEtapa('E a área logada de cliente deve ser exibida')
    cy.contains('h1', /Serverest Store/i).should('be.visible')
    cy.contains(/Produtos/i).should('be.visible')
    cy.contains('button', /Logout/i).should('be.visible')
  })
})
