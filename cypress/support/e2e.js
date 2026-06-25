import './commands'
import './api-commands'

// Mantém os testes independentes entre si ao iniciar cada cenário com uma sessão limpa.
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
