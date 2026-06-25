Cypress.Commands.add('preencherFormularioProduto', (produto) => {
  cy.log(`Preenchendo formulário do produto ${produto.nome}`)

  cy.obterPorTestId('nome').clear().type(produto.nome)
  cy.obterPorTestId('preco').clear().type(`${produto.preco}`)
  cy.obterPorTestId('descricao').clear().type(produto.descricao)
  cy.obterPorTestId('quantity').clear().type(`${produto.quantidade}`)
})

Cypress.Commands.add('submeterCadastroProduto', () => {
  cy.log('Submetendo formulário de cadastro de produto')
  cy.obterPorTestId('cadastarProdutos').click()
})

Cypress.Commands.add('cadastrarProdutoUi', (produto) => {
  cy.log('Cadastrando produto pela interface administrativa')

  cy.acessarTelaCadastroProduto()
  cy.contains('h1', /Cadastro de Produtos/i).should('be.visible')

  cy.preencherFormularioProduto(produto)
  cy.submeterCadastroProduto()
})

Cypress.Commands.add('validarProdutoNaListagemAdministrativa', (produto) => {
  cy.log(`Validando produto ${produto.nome} na listagem administrativa`)

  cy.location('pathname', { timeout: 10000 }).should('eq', '/admin/listarprodutos')
  cy.contains('h1', /Lista dos Produtos/i).should('be.visible')
  cy.contains('td', produto.nome).should('be.visible')
  cy.contains('td', `${produto.preco}`).should('be.visible')
  cy.contains('td', produto.descricao).should('be.visible')
})

Cypress.Commands.add('pesquisarProdutoUi', (nomeProduto) => {
  cy.log(`Pesquisando produto ${nomeProduto}`)

  cy.obterPorTestId('pesquisar').clear().type(nomeProduto)
  cy.obterPorTestId('botaoPesquisar').click()
  cy.contains(nomeProduto, { timeout: 10000 }).should('be.visible')
})
