import { FastifyPluginAsync } from 'fastify'

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // C = CREATE
    fastify.post('/api/users', async function (request, reply) {
        const data: any = request.body
        delete data.uid
        return await fastify.db('sys_user').insert(request.body)
    })

    // R = READ
    fastify.get('/api/users', async function (request, reply) {
        return await fastify.db('sys_user').select()
    })

    // READ by userId
    fastify.get('/api/users/:userId', async function (request, reply) {
        const params: any = request.params
        const userId = params.userId
        try {
            const listUser: any[] = await fastify.db('sys_user').select().where({ uid: userId })
            if (listUser.length == 1) {
                return listUser[0]
            } else {
                throw new Error('User id: ' + userId + ' not found!')
            }
        } catch (err) {
            return err
        }
    })

    // U = UPDATE
    fastify.put('/api/users/:userId', async function (request, reply) {
        const params: any = request.params
        const userId = params.userId

        const data: any = request.body
        delete data.uid
        try {
            const listUser: any[] = await fastify.db('sys_user').select().where({ uid: userId })
            if (listUser.length == 1) {
                return await fastify.db('sys_user').update(data).where({ uid: userId })
            } else {
                throw new Error('User id: ' + userId + ' not found!')
            }
        } catch (err: any) {
            return err
        }
    })

    // D = DELETE
    fastify.delete('/api/users/:userId', async function (request, reply) {
        const params: any = request.params
        const userId = params.userId
        try {
            const listUser: any[] = await fastify.db('sys_user').select().where({ uid: userId })
            if (listUser.length == 1) {
                return await fastify.db('sys_user').delete().where({ uid: userId })
            } else {
                throw new Error('User id: ' + userId + ' not found!')
            }
        } catch (err: any) {
            return err
        }
    })

}

export default user
