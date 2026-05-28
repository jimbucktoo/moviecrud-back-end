exports.seed = async function(knex) {
    await knex('movies').del()
    await knex('users').del()
}
