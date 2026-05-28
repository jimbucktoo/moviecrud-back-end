import dotenv from 'dotenv'
dotenv.config()

import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    PORT: z.string().default('8080'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const missing = Object.keys(errors).join(', ')
    console.error(`Fatal: missing or invalid environment variables: ${missing}`)
    console.error(JSON.stringify(errors, null, 2))
    process.exit(1)
}

export const config = result.data
