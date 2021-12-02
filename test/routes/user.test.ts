import { build } from '../helper'
import db from '../../src/config/database'

const app = build()

const validUser = {
    'username': 'leenawat1',
    'password': '123456',
    'prename': 'นาย',
    'fname': 'ลีนวัตร',
    'lname': 'พาพะหม'
}

const postUser = async (user = { ...validUser }) => {
    return await app.inject({
        url: '/api/users',
        method: 'post',
        payload: user
    })
}

describe('user tests', () => {
    beforeEach(async () => {
        await db('sys_user').truncate()
    })

    it('returns 201 ok when post valid user', async () => {
        const res = await postUser()
        expect(res.statusCode).toBe(201)
    })

    it('returns success message when post user request is valid', async () => {
        const res = await postUser()
        expect(res.json()).toEqual({ message: 'User created' })
    })

    it('save the user to database', async () => {
        await postUser()
        const userList = await db('sys_user').select()
        expect(userList.length).toBe(1)
    })
})