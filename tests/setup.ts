import db from '../src/db'

export async function cleanDb() {
    await db('movies').delete()
    await db('users').delete()
}

export { db }
