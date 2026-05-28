import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { graphqlHTTP } from 'express-graphql'
import { GraphQLError } from 'graphql'
import { schema } from './schema/schema'
import { config } from './config'
import { getAuthUser } from './auth'

const app = express()

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)

app.use(
    cors({
        origin: config.CORS_ORIGIN,
        credentials: true,
    })
)

app.use(express.json())

app.use('/graphql', (req: Request, res: Response) => {
    graphqlHTTP({
        schema,
        graphiql: true,
        context: { user: getAuthUser(req) },
        customFormatErrorFn: (error: GraphQLError) => {
            // Only log unexpected server errors — not auth or validation failures
            const isClientError =
                !error.originalError ||
                error.message.startsWith('Unauthenticated') ||
                error.message.startsWith('Invalid email') ||
                error.message.startsWith('Email already') ||
                error.originalError instanceof Error === false
            if (!isClientError) {
                console.error('GraphQL error:', error.message)
            }
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
            }
        },
    })(req, res)
})

app.get('/favicon.ico', (_req: Request, res: Response) => res.sendStatus(204))

app.get('/', (_req: Request, res: Response) => {
    res.send('MovieCrud Server')
})

// Centralized error handler — never leak stack traces
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

app.get('*', (_req: Request, res: Response) => {
    res.status(404).send('Page Not Found: 404')
})

export { app }
