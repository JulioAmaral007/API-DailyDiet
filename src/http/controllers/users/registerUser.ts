import prismaClient from '@/lib/prismaClient'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  const userWithSameEmail = await prismaClient.user.findUnique({
    where: {
      email,
    },
  })
  if (userWithSameEmail) {
    throw new Error('User with same e-mail address already exists.')
  }

  const hashedPassword = await hash(password, 8)

  await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return reply.status(201).send()
}
