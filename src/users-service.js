const UsersService = {
    getUsers(knex) {
        return knex('users').select('*')
    },
    insertUser(knex, name) {
        return knex('users')
            .insert(name)
            .returning('*')
            .then(row => {
                return row[0]
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