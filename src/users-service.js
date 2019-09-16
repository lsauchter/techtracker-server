const UsersService = {
    getUsers(knex) {
        return knex('users').select('*')
    },
    insertUser(knex, name) {
        return knex
            .insert(name)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    removeUser(knex, userId) {
        return knex('users')
        .where({
            'id': userId
        })
        .delete()
    }
}

module.exports = UsersService