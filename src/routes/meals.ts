import prismaClient from '@/lib/prismaClient'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      // A partir deste sessionID, buscar os dados na tabela users para adicionar durante a criação de uma nova refeição na tabela meals
      // Desestruturando o user para depois armazenar apenas o seu ID na variável userID
      const user = await prismaClient.user.findFirst({
        where: {
          session_id: sessionId,
        },
      })

      if (!sessionId) {
        reply.status(401).send()
      }

      const userId = user.id

      // Após a identificação do usuário, armazena o dado de seu id para posteriormente adicionar na tabela de meals junto ao prato
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, isDiet } = createMealBodySchema.parse(
        request.body,
      )

      await prismaClient.diet.create({
        data: {
          userId,
          name,
          description,
          isDiet,
        },
      })

      return reply.status(201).send()
    },
  )

  // Editando uma refeição cadastrada
  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // Capturando o parâmetro id pelos params e tipando
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const params = getMealParamsSchema.parse(request.params)

      // Buscando o usuário partir dos cookies
      const { sessionId } = request.cookies

      // Buscando o id do usuário com base no session_id
      const user = await prismaClient.user.findFirst({
        where: {
          session_id: sessionId,
        },
      })

      const userId = user?.id

      // Validando e capturando o que o usuário está mandando pelo body
      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, isDiet } = editMealBodySchema.parse(
        request.body,
      )

      // Buscando a refeição existente, passando o id que veio por params e o id do usuário capturado pelo session_id
      const mealId = params.id

      const meal = await prismaClient.diet.update({
        where: {
          id: mealId,
        },
        data: {
          userId,
          name,
          description,
          isDiet,
        },
      })

      // Caso não seja encontrada no db
      if (!meal) {
        return reply.status(401).send({
          error: 'Refeição não encontrada',
        })
      }

      return reply.status(202).send()
    },
  )

  // Apagando uma refeição cadastrada
  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const params = getMealParamsSchema.parse(request.params)

      // Buscando o usuário
      const { sessionId } = request.cookies

      // Buscando o id do usuário com base no session_id
      const user = await prismaClient.user.findFirst({
        where: {
          session_id: sessionId,
        },
      })

      const userId = user?.id

      if (!userId) {
        reply.status(401).send()
      }

      // Buscando a refeição existente, passando o id que veio por params e o id do usuário capturado pelo session_id
      const mealId = params.id

      await prismaClient.diet.delete({
        where: {
          id: mealId,
        },
      })

      return reply.status(202).send('Refeição deletada com sucesso')
    },
  )

  // Listando todas refeições apenas do usuário
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      // Buscando o id do usuário com base no session_id
      const user = await prismaClient.user.findFirst({
        where: {
          session_id: sessionId,
        },
      })

      const userId = user?.id

      if (!userId) {
        reply.status(401).send()
      }

      // .where('user_id', userId) -> Selecionar apenas onde a coluna user_id seja correspondende ao id do usuário que criou o prato
      const meals = await prismaClient.diet.findMany({
        where: {
          userId,
        },
      })

      return {
        meals,
      }
    },
  )

  // Listando uma refeição específica do usuário
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // Capturando os parâmetros nomeados (/:id)
      // Tipando
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const params = getMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      // Buscando o id do usuário com base no session_id
      const user = await prismaClient.user.findFirst({
        where: {
          session_id: sessionId,
        },
      })

      const userId = user?.id

      if (!userId) {
        reply.status(401).send()
      }

      // Buscando a refeição do db
      // Buscando na tabela meals, na coluna ID, o params.id (que é o que vem da rota)
      const mealId = params.id

      const meal = await prismaClient.diet.findMany({
        where: {
          id: mealId,
        },
      })

      return { meal }
    },
  )

  // // Resumo das refeições
  // app.get(
  //   '/summary',
  //   { preHandler: [checkSessionIdExists] },
  //   async (request) => {
  //     // .sum('coluna') => Soma a quantidade de valores de uma coluna do db

  //     // Buscando o usuário
  //     const { sessionId } = request.cookies

  //     const [user] = await knex('users')
  //       .where('session_id', sessionId)
  //       .select('id')

  //     const userId = user.id

  //     const [count] = await knex('meals')
  //       .count('id', {
  //         as: 'Total de refeições registradas',
  //       })
  //       .where('user_id', userId)

  //     const refDieta = await knex('meals')
  //       .count('id', { as: 'Total de refeições dentro da dieta' })
  //       .where('isOnTheDiet', true)
  //       .andWhere('user_id', userId)

  //     const refForaDieta = await knex('meals')
  //       .count('id', { as: 'Total de refeições fora da dieta' })
  //       .where('isOnTheDiet', false)
  //       .andWhere('user_id', userId)

  //     const summary = {
  //       'Total de refeições registradas': parseInt(
  //         JSON.parse(JSON.stringify(count))['Total de refeições registradas'],
  //       ),

  //       'Total de refeições dentro da dieta': parseInt(
  //         JSON.parse(JSON.stringify(refDieta))[0][
  //         'Total de refeições dentro da dieta'
  //         ],
  //       ),

  //       'Total de refeições fora da dieta': parseInt(
  //         JSON.parse(JSON.stringify(refForaDieta))[0][
  //         'Total de refeições fora da dieta'
  //         ],
  //       ),
  //     }

  //     return {
  //       summary,
  //     }
  //   },
  // )
}
