import { buildUser, credenciaisInvalidas } from '../../support/data-factory'

describe('API - Autenticação', () => {
  let usuarioCriado

  after(() => {
    if (usuarioCriado?._id) {
      cy.apiDeleteUser(usuarioCriado._id)
    }
  })

  it('deve autenticar credenciais válidas e rejeitar senha inválida', () => {
    const usuario = buildUser({ nomePrefixo: 'Usuário Auth' })

    cy.apiCreateUser(usuario).then((createdUser) => {
      usuarioCriado = createdUser

      cy.apiLogin(usuario).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Login realizado com sucesso')
        expect(response.body)
          .to.have.property('authorization')
          .and.to.match(/^Bearer\s.+/)
      })

      cy.apiLogin(credenciaisInvalidas(usuario)).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
      })
    })
  })
})
