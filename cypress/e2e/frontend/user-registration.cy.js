import { buildUser } from '../../support/data-factory'

describe('Frontend - Cadastro de cliente', () => {
  let usuarioCriado

  after(() => {
    if (usuarioCriado?._id) {
      cy.apiDeleteUser(usuarioCriado._id)
    }
  })

  it('deve cadastrar cliente pela interface e redirecionar para a área logada', () => {
    const usuario = buildUser({ nomePrefixo: 'Cliente Front' })

    cy.registerClientByUi(usuario)

    cy.request({
      method: 'GET',
      url: `${Cypress.expose('apiUrl')}/usuarios`,
      qs: { email: usuario.email },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
      expect(response.body.usuarios[0]).to.include({
        nome: usuario.nome,
        email: usuario.email,
        administrador: 'false',
      })

      usuarioCriado = response.body.usuarios[0]
    })

    cy.contains('h1', /Serverest Store/i).should('be.visible')
    cy.contains(/Produtos/i).should('be.visible')
    cy.contains('button', /Logout/i).should('be.visible')
  })
})
