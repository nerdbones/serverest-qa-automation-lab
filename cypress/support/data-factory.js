import { faker } from '@faker-js/faker'

const senhaPadrao = 'Teste@12345'

const gerarSufixoUnico = () => `${Date.now()}-${faker.string.alphanumeric(6).toLowerCase()}`

export const buildUser = ({ administrador = 'false', nomePrefixo = 'Usuário QA' } = {}) => {
  const sufixo = gerarSufixoUnico()

  return {
    nome: `${nomePrefixo} ${sufixo}`,
    email: `qa.${sufixo}@serverest.com.br`,
    password: senhaPadrao,
    administrador,
  }
}

export const buildProduct = ({ nomePrefixo = 'Produto QA' } = {}) => {
  const sufixo = gerarSufixoUnico()

  return {
    nome: `${nomePrefixo} ${sufixo}`,
    preco: faker.number.int({ min: 50, max: 500 }),
    descricao: `Produto criado pela automação para validar jornada crítica ${sufixo}.`,
    quantidade: faker.number.int({ min: 5, max: 30 }),
  }
}

export const credenciaisInvalidas = (usuario) => ({
  email: usuario.email,
  password: `${usuario.password}-invalida`,
})
