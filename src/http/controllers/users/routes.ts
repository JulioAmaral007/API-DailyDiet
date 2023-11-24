import { FastifyInstance } from 'fastify'

import { registerUser } from './registerUser'
import { showUsers } from './showUsers'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.get('/user', showUsers)
  // app.post('/sessions', authenticate)

  // app.patch('/token/refresh', refresh)

  // /** Authenticated */
  // app.get('/me', { onRequest: [verifyJwt] }, profile)
}
