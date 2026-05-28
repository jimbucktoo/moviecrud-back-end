exports.up = function(knex, Promise) {
    return knex.schema.createTable('movies', (movie) => {
        movie.increments('id')
        movie.string('title')
        movie.string('directors')
        movie.integer('year')
        movie.integer('rating')
        movie.string('poster_url')
        movie.integer('user_id').unsigned().references('id').inTable('users')
        movie.timestamps(false, true)
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('movies')
}
