## Daily Diet API
API desenvolvida para registras todas as refeições que um usuário fizer durante o seu dia.

Quando o usuário se registra, um cookie é criado e armazenado. Utilizamos esse cookie para validar o registro, adicionando-o na coluna "session_id" da tabela "users". Depois, usamos esse identificador para validar o usuário que está adicionando uma nova refeição, de modo que possamos adicionar o ID do usuário na tabela "meals".

### 🛠️ Nesse projeto foi utilizado

* Fastify
* Banco de dados - SQLite
* Typescript
* Zod
* ORM Prisma
* Vitest

## Regras da aplicação

  - [x] Deve ser possível criar um usuário
  - [x] Deve ser possível identificar o usuário entre as requisições
  - [ ] Deve ser possível registrar uma refeição feita, com as seguintes informações:  
      - Nome
      - Descrição
      - Data e Hora
      - Está dentro ou não da dieta
  - [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
  - [ ] Deve ser possível apagar uma refeição
  - [ ] Deve ser possível listar todas as refeições de um usuário
  - [ ] Deve ser possível visualizar uma única refeição
  - [ ] Deve ser possível recuperar as métricas de um usuário
      - Quantidade total de refeições registradas
      - Quantidade total de refeições dentro da dieta
      - Quantidade total de refeições fora da dieta
      - Melhor sequência por dia de refeições dentro da dieta
  - [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou


## Instalação

```bash
# Faça o clone do repositório
  git clone git@github.com:JulioAmaral007/API-DailyDiet.git

# Instalar as dependências do projeto
  npm install

# Executando o projeto no ambiente de desenvolvimento
  npm run dev
  
# Rodar as migrations do projeto para criar o banco de dados
  npm run migrate dev
```

## Rotas
- Criar novo usuário
```bash
POST /users
```

- Criar novo registro de refeição
```bash
POST /meals
```

- Listar todas refeições registradas pelo usuário
```bash
GET /meals
```

- Listar uma refeição específica registrada pelo usuário
```bash
GET /meals/:${meal_id}
```

- Mostrar um resumo geral das refeições cadastradas pelo usuário (total de refeições, refeições dentro da dieta e refeições fora da dieta)
```bash
GET /meals/summary
```

- Deletar uma refeição cadastrada
```bash
DELETE /meals/:${meal_id}
```

- Editar uma refeição cadastrada
```bash
PUT /meals/:${meal_id}
```

## Testes automatizados e2e
  - [ ] Should be able to create a new account
  - [ ] Should be able to create a new meal
  - [ ] Should be able to list all meals
  - [ ] Should be able to get a specific meals
  - [ ] Should be able to get the summary meals
  - [ ] Should be able to delete a specific meal
  - [ ] Should be able to edit a meal

```bash
# Após a instalação do projeto e suas depêndencias:
  npm run test
