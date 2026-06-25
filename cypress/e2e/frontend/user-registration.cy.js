import { buildUser } from '../../support/data-factory'

describe('Frontend - Cadastro de cliente', () => {
  const emailsGerados = []
  let usuario
  let usuarioCriado

  beforeEach(() => {
    usuario = buildUser({ nomePrefixo: 'Cliente Front' })
    usuarioCriado = undefined
    emailsGerados.push(usuario.email)
  })

  after(() => {
    cy.registrarEtapa('Limpando clientes cadastrados durante o cenário')

    cy.wrap(emailsGerados, { log: false }).each((email) => {
      cy.consultarUsuariosPorEmailApi(email).then((response) => {
        const usuarioEncontrado = response.body.usuarios?.[0]

        if (usuarioEncontrado?._id) {
          cy.excluirUsuarioApi(usuarioEncontrado._id)
        }
      })
    })
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
