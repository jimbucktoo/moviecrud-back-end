import request from 'supertest'
import { app } from '../src/app'
import { db, cleanDb } from './setup'

const REGISTER = (email: string, password: string, username: string) => ({
    query: `mutation {
        register(email: "${email}", password: "${password}", username: "${username}") {
            token
            user { id email username }
        }
    }`,
})

const LOGIN = (email: string, password: string) => ({
    query: `mutation {
        login(email: "${email}", password: "${password}") {
            token
            user { id email }
        }
    }`,
})

beforeAll(async () => {
    await db.migrate.latest()
})

afterAll(async () => {
    await db.destroy()
})

beforeEach(async () => {
    await cleanDb()
})

describe('register mutation', () => {
    it('creates a new user and returns a token', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(REGISTER('user@example.com', 'password123', 'testuser'))

        expect(res.status).toBe(200)
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.register.token).toBeDefined()
        expect(res.body.data.register.user.email).toBe('user@example.com')
    })

    it('rejects duplicate email', async () => {
        await request(app)
            .post('/graphql')
            .send(REGISTER('dup@example.com', 'password123', 'user1'))

        const res = await request(app)
            .post('/graphql')
            .send(REGISTER('dup@example.com', 'password123', 'user2'))

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/already registered/i)
    })

    it('rejects invalid email', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(REGISTER('not-an-email', 'password123', 'user1'))

        expect(res.body.errors).toBeDefined()
    })

    it('rejects short password', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(REGISTER('user@example.com', 'short', 'user1'))

        expect(res.body.errors).toBeDefined()
    })
})

describe('login mutation', () => {
    beforeEach(async () => {
        await request(app)
            .post('/graphql')
            .send(REGISTER('login@example.com', 'password123', 'loginuser'))
    })

    it('returns a token for valid credentials', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(LOGIN('login@example.com', 'password123'))

        expect(res.status).toBe(200)
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.login.token).toBeDefined()
    })

    it('rejects wrong password', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(LOGIN('login@example.com', 'wrongpassword'))

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/invalid/i)
    })

    it('rejects non-existent user', async () => {
        const res = await request(app)
            .post('/graphql')
            .send(LOGIN('ghost@example.com', 'password123'))

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/invalid/i)
    })
})
