import { FastifyInstance } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        db: Knex;
    }
}