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

    it('password ที่เก็บใน database ต้องไม่เป็น plaintext', async () => {
        await postUser()
        const user = await db('sys_user').first()
        expect(user.password).not.toBe(validUser.password)
    })

    it('user 2 คนที่มี password เหมือนกัน จะต้องถูกเก็บโดยเข้ารหัสแล้วต้องไม่เหมือนกัน', async () => {
        await postUser()
        await postUser({
            'username': 'leenawat2',
            'password': '123456',
            'prename': 'นาย',
            'fname': 'ลีนวัตร',
            'lname': 'พาพะหม'
        })
        const userList = await db('sys_user').select()
        expect(userList[0].password).not.toBe(userList[1].password)
    })


    it('update user info success', async () => {
        await postUser()
        const user = await db('sys_user').select().first()
        user.fname = 'Leenawat'
        user.lname = 'Papahom'

        await app.inject({
            url: '/api/users/' + user.uid,
            method: 'put',
            payload: user
        })
        const userUpdated = await db('sys_user').select().first()
        expect(userUpdated.fname).toBe(user.fname)
        expect(userUpdated.lname).toBe(user.lname)
    })

    it('delete user info success', async () => {
        await postUser()
        const user = await db('sys_user').select().first()
        await app.inject({
            url: '/api/users/' + user.uid,
            method: 'delete'
        })
        const userList = await db('sys_user').select()
        expect(userList.length).toBe(0)

    })
})