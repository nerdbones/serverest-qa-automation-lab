import { buildUser, credenciaisInvalidas } from '../../support/data-factory'

describe('API - Autenticação de usuários', () => {
  let usuario
  let usuarioCriado

  before(() => {
    usuario = buildUser({ nomePrefixo: 'Usuário Auth' })

    cy.registrarEtapa('Preparando usuário para validação de autenticação')
    cy.criarUsuarioApi(usuario).then((createdUser) => {
      usuarioCriado = createdUser
    })
  })

  after(() => {
    cy.registrarEtapa('Limpando usuário criado durante o cenário')

    if (usuarioCriado?._id) {
      cy.excluirUsuarioApi(usuarioCriado._id)
    }
  })

  it('deve autenticar credenciais válidas e rejeitar tentativa com senha inválida', () => {
    cy.registrarEtapa('Quando o login é realizado com credenciais válidas')
    cy.autenticarUsuarioApi(usuario, { validarSucesso: true }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(response.body)
        .to.have.property('authorization')
        .and.to.match(/^Bearer\s.+/)
    })

    cy.registrarEtapa('Então a API deve rejeitar autenticação com senha inválida')
    cy.autenticarUsuarioApi(credenciaisInvalidas(usuario)).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
    })
  })
})
