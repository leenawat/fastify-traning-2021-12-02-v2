import { FastifyPluginAsync } from 'fastify'
import UserModel from '../models/user'
import bcrypt from 'bcryptjs'

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const userModel = new UserModel(fastify.db)
    // C = CREATE
    fastify.post('/api/users', async function (request, reply) {
        const data: any = request.body
        delete data.uid
        data.password = await bcrypt.hashSync(data.password)
        await userModel.save(data)
        return reply.code(201).send({ message: 'User created' })
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
            const listUser: any[] = await userModel.findByUid(userId)
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
            const listUser: any[] = await userModel.findByUid(userId)
            if (listUser.length == 1) {
                return await userModel.update(userId, data)
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
            const listUser: any[] = await userModel.findByUid(userId)
            if (listUser.length == 1) {
                return await userModel.delete(userId)
            } else {
                throw new Error('User id: ' + userId + ' not found!')
            }
        } catch (err: any) {
            return err
        }
    })

}

export default user
