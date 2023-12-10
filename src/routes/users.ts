import prismaClient from '@/lib/prismaClient'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

// TODO plugin deve ser async
export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    // capturando os dados do usuário e validando com o zod
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      weight: z.number(),
      height: z.number(),
    })

    // Validando os dados do request.body para ver se bate com o schema de validação
    const { name, email, password, weight, height } =
      createUserBodySchema.parse(request.body)

    // Conferindo se o email já está cadastrado
    const checkUserExist = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })

    if (checkUserExist) {
      return reply.status(400).send({
        error: 'Este email já está vinculado à um usuário',
      })
    }

    // Verificando se já existe uma sessionID
    let sessionId = request.cookies.sessionId

    // Caso não exista, criar um
    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/meals', // apenas as rotas /meals podem acessar ao cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const passwordHash = await hash(password, 6)

    await prismaClient.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        weight,
        height,
        session_id: sessionId,
      },
    })

    return reply.status(201).send()
  })
}
