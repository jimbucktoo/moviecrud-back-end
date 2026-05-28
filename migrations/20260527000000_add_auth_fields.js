exports.up = async function (knex) {
    const hasPasswordHash = await knex.schema.hasColumn('users', 'password_hash')
    if (!hasPasswordHash) {
        await knex.schema.alterTable('users', (table) => {
            table.string('password_hash').nullable()
        })
    }
    // Make authId nullable to support email/password users
    await knex.raw('ALTER TABLE users ALTER COLUMN "authId" DROP NOT NULL')
    // Make picture nullable since email/password users may not have one
    await knex.raw('ALTER TABLE users ALTER COLUMN picture DROP NOT NULL')
}

exports.down = async function (knex) {
    const hasPasswordHash = await knex.schema.hasColumn('users', 'password_hash')
    if (hasPasswordHash) {
        await knex.schema.alterTable('users', (table) => {
            table.dropColumn('password_hash')
        })
    }
}
