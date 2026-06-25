Cypress.Commands.add('adicionarPrimeiroProdutoNaListaDeCompras', () => {
  cy.log('Adicionando primeiro produto encontrado à lista de compras')
  cy.obterPorTestId('adicionarNaLista').first().click()
})

Cypress.Commands.add('validarProdutoNaListaDeCompras', (produto) => {
  cy.log(`Validando produto ${produto.nome} na lista de compras`)

  cy.contains('h1', /Lista de Compras/i, { timeout: 10000 }).should('be.visible')
  cy.obterPorTestId('shopping-cart-product-name').should('contain.text', produto.nome)
  cy.contains(`Preço R$${produto.preco}`).should('be.visible')
})

Cypress.Commands.add('limparListaDeCompras', () => {
  cy.log('Limpando lista de compras')

  cy.obterPorTestId('limparLista').click()
  cy.contains(/Seu carrinho está vazio/i).should('be.visible')
})

Cypress.Commands.add('limparListaDeComprasSeExistir', () => {
  cy.log('Verificando se há lista de compras para limpar')

  cy.get('body').then(($body) => {
    const botaoLimpar = [...$body.find('button')].find((button) =>
      /Limpar Lista/i.test(button.innerText)
    )

    if (botaoLimpar) {
      cy.wrap(botaoLimpar).click()
    }
  })
})
