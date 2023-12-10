import prismaClient from '@/lib/prismaClient'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/meals',
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

      const userId = user?.id
      // console.log(userId)

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
}
