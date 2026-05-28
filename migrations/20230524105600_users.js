exports.up = function(knex) {
    return knex.schema.createTable('users', (user) => {
        user.increments('id')
        user.string('authId').notNullable()
        user.string('username').notNullable()
        user.string('email').notNullable().unique()
        user.string('picture').notNullable()
        user.timestamps(false, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('users')
}
