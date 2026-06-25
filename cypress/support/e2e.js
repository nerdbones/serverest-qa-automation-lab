import './commands/api/auth.commands'
import './commands/api/users.commands'
import './commands/api/products.commands'
import './commands/api/carts.commands'

import './commands/ui/navigation.commands'
import './commands/ui/auth.commands'
import './commands/ui/users.commands'
import './commands/ui/products.commands'
import './commands/ui/carts.commands'

import './commands/evidence/evidence.commands'

// Mantém os testes independentes entre si ao iniciar cada cenário com uma sessão limpa.
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
