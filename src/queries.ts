import db from './db'

export interface User {
    id: number
    authId: string | null
    username: string
    email: string
    picture: string | null
    password_hash: string | null
    created_at: Date
    updated_at: Date
}

export interface Movie {
    id: number
    title: string
    directors: string
    year: number
    rating: number
    poster_url: string
    user_id: number | null
    created_at: Date
    updated_at: Date
}

export const queries = {
    getAllUsers(): Promise<User[]> {
        return db.select().from('users')
    },
    getUserById(id: number | string): Promise<User | undefined> {
        return db('users').where('id', id).first()
    },
    getUserByAuthId(authId: string): Promise<User | undefined> {
        return db('users').where('authId', authId).first()
    },
    getUserByEmail(email: string): Promise<User | undefined> {
        return db('users').where('email', email).first()
    },
    createUser(item: Partial<User>): Promise<User[]> {
        return db('users').insert(item).returning('*')
    },
    updateUser(id: number | string, updateData: Partial<User>): Promise<User[]> {
        return db('users').where('id', id).update(updateData).returning('*')
    },
    deleteUser(id: number | string): Promise<User[]> {
        return db('users').where('id', id).delete().returning('*')
    },
    deleteAllUsers(): Promise<User[]> {
        return db('users').delete().returning('*')
    },
    getAllMovies(): Promise<Movie[]> {
        return db.select().from('movies')
    },
    getMoviesByUserId(id: number | string): Promise<Movie[]> {
        return db.select().from('movies').where('user_id', id)
    },
    getMovieById(id: number | string): Promise<Movie | undefined> {
        return db('movies').where('id', id).first()
    },
    createMovie(item: Partial<Movie>): Promise<Movie[]> {
        return db('movies').insert(item).returning('*')
    },
    updateMovie(id: number | string, updateData: Partial<Movie>): Promise<Movie[]> {
        return db('movies').where('id', id).update(updateData).returning('*')
    },
    deleteMovie(id: number | string): Promise<Movie[]> {
        return db('movies').where('id', id).delete().returning('*')
    },
    deleteAllMovies(): Promise<Movie[]> {
        return db('movies').delete().returning('*')
    },
}
