import { buildUser } from '../../support/data-factory'

describe('API - Usuários', () => {
  let usuarioCriado

  after(() => {
    if (usuarioCriado?._id) {
      cy.apiDeleteUser(usuarioCriado._id)
    }
  })

  it('deve cadastrar usuário, consultá-lo por e-mail e impedir e-mail duplicado', () => {
    const usuario = buildUser({ nomePrefixo: 'Usuário API' })

    cy.apiCreateUser(usuario).then((createdUser) => {
      usuarioCriado = createdUser

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
          administrador: usuario.administrador,
          _id: usuarioCriado._id,
        })
      })

      cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/usuarios`,
        body: usuario,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('message', 'Este email já está sendo usado')
      })
    })
  })
})
