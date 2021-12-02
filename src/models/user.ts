
import { Knex } from 'knex'

export default class UserModel {

    db: Knex

    constructor(db: Knex) {
        this.db = db
    }

    async save(data: any) {
        return await this.db('sys_user').insert(data)
    }

    async findByUid(userId: any): Promise<any> {
        return await this.db('sys_user')
            .select()
            .where({ uid: userId })
    }

    async update(userId: any, data: any) {
        return await this.db('sys_user')
            .update(data)
            .where({ uid: userId })
    }

    async delete(userId: any) {
        return await this.db('sys_user')
            .delete()
            .where({ uid: userId })

    }
}

