import request from 'supertest'
import { app } from '../src/app'
import { db, cleanDb } from './setup'

const REGISTER_QUERY = `mutation {
    register(email: "movies@example.com", password: "password123", username: "movieuser") {
        token
        user { id }
    }
}`

const ADD_MOVIE = (token: string) =>
    request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
            query: `mutation {
                addMovie(
                    title: "Test Movie"
                    directors: "Test Director"
                    year: 2023
                    rating: 5
                    poster_url: "https://example.com/poster.jpg"
                ) { id title directors year rating poster_url user_id }
            }`,
        })

let token: string
let movieId: number

beforeAll(async () => {
    await db.migrate.latest()
})

afterAll(async () => {
    await db.destroy()
})

beforeEach(async () => {
    await cleanDb()
    const res = await request(app).post('/graphql').send({ query: REGISTER_QUERY })
    token = res.body.data.register.token
})

describe('movies query (public)', () => {
    it('returns movies without auth', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({ query: '{ movies { id title } }' })

        expect(res.status).toBe(200)
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.movies).toBeInstanceOf(Array)
    })
})

describe('addMovie mutation (protected)', () => {
    it('adds a movie when authenticated', async () => {
        const res = await ADD_MOVIE(token)

        expect(res.status).toBe(200)
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.addMovie.title).toBe('Test Movie')
        expect(res.body.data.addMovie.year).toBe(2023)
        expect(res.body.data.addMovie.rating).toBe(5)
    })

    it('rejects addMovie without auth', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: `mutation {
                    addMovie(
                        title: "No Auth Movie"
                        directors: "Director"
                        year: 2023
                        rating: 4
                        poster_url: "https://example.com/p.jpg"
                    ) { id }
                }`,
            })

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/unauthenticated/i)
    })

    it('rejects invalid year', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation {
                    addMovie(
                        title: "Old Movie"
                        directors: "Director"
                        year: 1800
                        rating: 3
                        poster_url: "https://example.com/p.jpg"
                    ) { id }
                }`,
            })

        expect(res.body.errors).toBeDefined()
    })
})

describe('updateMovie mutation (protected)', () => {
    beforeEach(async () => {
        const res = await ADD_MOVIE(token)
        movieId = res.body.data.addMovie.id
    })

    it('updates a movie when authenticated', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation {
                    updateMovie(
                        id: "${movieId}"
                        title: "Updated Title"
                        directors: "Updated Director"
                        year: 2024
                        rating: 3
                        poster_url: "https://example.com/updated.jpg"
                    ) { id title year }
                }`,
            })

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.updateMovie.title).toBe('Updated Title')
    })

    it('rejects updateMovie without auth', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: `mutation {
                    updateMovie(
                        id: "${movieId}"
                        title: "Unauthorized Update"
                        directors: "D"
                        year: 2023
                        rating: 3
                        poster_url: "https://example.com/p.jpg"
                    ) { id }
                }`,
            })

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/unauthenticated/i)
    })
})

describe('deleteMovie mutation (protected)', () => {
    beforeEach(async () => {
        const res = await ADD_MOVIE(token)
        movieId = res.body.data.addMovie.id
    })

    it('deletes a movie when authenticated', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation {
                    deleteMovie(id: "${movieId}") { id title }
                }`,
            })

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.deleteMovie.id).toBe(movieId)
    })

    it('rejects deleteMovie without auth', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: `mutation { deleteMovie(id: "${movieId}") { id } }`,
            })

        expect(res.body.errors).toBeDefined()
        expect(res.body.errors[0].message).toMatch(/unauthenticated/i)
    })
})
