import { IncomingMessage } from 'http'
import jwt from 'jsonwebtoken'
import { config } from './config'

export interface AuthUser {
    id: number
    email: string
}

export function signToken(user: { id: number; email: string }): string {
    return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: '24h' })
}

export function getAuthUser(req: IncomingMessage): AuthUser | null {
    const header = req.headers.authorization
    if (!header) return null
    const parts = header.split(' ')
    if (parts[0] !== 'Bearer' || !parts[1]) return null
    try {
        return jwt.verify(parts[1], config.JWT_SECRET) as AuthUser
    } catch {
        return null
    }
}

export function requireAuth(user: AuthUser | null): AuthUser {
    if (!user) throw new Error('Unauthenticated: please log in')
    return user
}
