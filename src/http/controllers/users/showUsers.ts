import prismaClient from '@/lib/prismaClient'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function showUsers(request: FastifyRequest, reply: FastifyReply) {
  const user = await prismaClient.user.findMany({})

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  return {
    user,
  }
}
