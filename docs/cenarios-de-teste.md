# Cenários de Teste

## Cenários de API

### API-001 - Cadastro, consulta e duplicidade de usuário

**Objetivo:** garantir que a API permite cadastrar usuário válido, consultar o registro por e-mail e bloquear duplicidade.

**Fluxo:**

1. Gerar usuário dinâmico.
2. Cadastrar usuário via `POST /usuarios`.
3. Validar status `201` e mensagem de sucesso.
4. Consultar usuário via `GET /usuarios?email=...`.
5. Validar dados retornados.
6. Tentar cadastrar o mesmo e-mail novamente.
7. Validar status `400` e mensagem de duplicidade.

### API-002 - Autenticação positiva e negativa

**Objetivo:** garantir que a API autentica credenciais válidas e rejeita senha inválida.

**Fluxo:**

1. Criar usuário válido.
2. Realizar login com credenciais corretas.
3. Validar status `200`, mensagem e token Bearer.
4. Realizar login com senha inválida.
5. Validar status `401` e mensagem de erro.

### API-003 - Produto e carrinho

**Objetivo:** validar fluxo integrado entre administrador, produto, cliente e carrinho.

**Fluxo:**

1. Criar usuário administrador.
2. Autenticar administrador.
3. Criar produto.
4. Criar usuário cliente.
5. Autenticar cliente.
6. Criar carrinho com duas unidades do produto.
7. Consultar carrinho por ID.
8. Validar produto, quantidade, preço total e vínculo com usuário.
9. Cancelar compra.

## Cenários de Frontend

### FE-001 - Cadastro de cliente pela interface

**Objetivo:** validar que um usuário cliente consegue se cadastrar pela UI e acessar a área logada.

**Fluxo:**

1. Acessar login.
2. Navegar para cadastro.
3. Preencher nome, e-mail e senha.
4. Submeter cadastro.
5. Validar criação via API.
6. Validar redirecionamento para `/home`.
7. Validar elementos da loja.

### FE-002 - Cadastro administrativo de produto

**Objetivo:** validar que um administrador autenticado consegue cadastrar produto pela UI.

**Fluxo:**

1. Criar administrador via API.
2. Autenticar pela UI.
3. Acessar cadastro de produtos.
4. Preencher dados do produto.
5. Submeter cadastro.
6. Validar redirecionamento para listagem.
7. Validar produto na tabela e via API.

### FE-003 - Cliente adiciona produto à lista de compras

**Objetivo:** validar que um cliente autenticado consegue buscar produto e adicioná-lo à lista de compras.

**Fluxo:**

1. Criar administrador via API.
2. Criar produto via API.
3. Criar cliente via API.
4. Autenticar cliente pela UI.
5. Buscar produto pelo nome.
6. Adicionar produto à lista.
7. Validar produto, preço e quantidade na lista.
8. Limpar lista.
