export const obterApiUrl = () => Cypress.expose('apiUrl')

export const validarStatus = (response, statusEsperado, contexto) => {
  expect(response.status, `${contexto} | resposta: ${JSON.stringify(response.body)}`).to.eq(
    statusEsperado
  )
}

export const montarHeadersAutenticados = (authorization) => ({
  Authorization: authorization,
})
