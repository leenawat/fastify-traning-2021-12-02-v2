import fp from 'fastify-plugin'
import db from '../config/database'

export default fp(async (fastify:any, opts:any, done:any) => {
    fastify.decorate('db', await db)
    done()
})