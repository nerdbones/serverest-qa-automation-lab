import { buildUser } from '../../support/data-factory'
import { obterApiUrl } from '../../support/commands/api/api.helpers'

describe('API - Gestão de usuários', () => {
  let usuario
  let usuarioCriado

  before(() => {
    usuario = buildUser({ nomePrefixo: 'Usuário API' })
  })

  after(() => {
    cy.registrarEtapa('Limpando usuário criado durante o cenário')

    if (usuarioCriado?._id) {
      cy.excluirUsuarioApi(usuarioCriado._id)
    }
  })

  it('deve cadastrar usuário, consultá-lo por e-mail e impedir novo cadastro com e-mail duplicado', () => {
    cy.registrarEtapa('Dado que existe uma massa válida para cadastro de usuário')
    cy.wrap(usuario).should('include.keys', ['nome', 'email', 'password', 'administrador'])

    cy.registrarEtapa('Quando o usuário é cadastrado pela API')
    cy.criarUsuarioApi(usuario).then((createdUser) => {
      usuarioCriado = createdUser
    })

    cy.registrarEtapa('Então deve ser possível consultar o usuário cadastrado por e-mail')
    cy.then(() => cy.consultarUsuariosPorEmailApi(usuario.email)).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
      expect(response.body.usuarios[0]).to.include({
        nome: usuario.nome,
        email: usuario.email,
        administrador: usuario.administrador,
        _id: usuarioCriado._id,
      })
    })

    cy.registrarEtapa('E a API deve impedir cadastro duplicado com o mesmo e-mail')
    cy.request({
      method: 'POST',
      url: `${obterApiUrl()}/usuarios`,
      body: usuario,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('message', 'Este email já está sendo usado')
    })
  })
})
