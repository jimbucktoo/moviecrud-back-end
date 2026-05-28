import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLResolveInfo,
} from 'graphql'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { queries } from '../queries'
import { signToken, requireAuth, AuthUser } from '../auth'

interface GraphQLContext {
    user: AuthUser | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Resolver<TArgs = Record<string, any>> = (
    parent: unknown,
    args: TArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
) => unknown

function formatZodError(err: ZodError): string {
    return err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
}

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z.string().min(1, 'Username is required').max(100, 'Username too long'),
})

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

const addMovieSchema = z.object({
    title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
    directors: z.string().min(1, 'Directors is required').max(500, 'Directors too long'),
    year: z
        .number()
        .int()
        .min(1888, 'Year must be 1888 or later')
        .max(2100, 'Year must be 2100 or earlier'),
    rating: z
        .number()
        .int()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    poster_url: z.string().url('poster_url must be a valid URL'),
})

const updateMovieSchema = addMovieSchema

const updateUserSchema = z.object({
    username: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    picture: z.string().url().optional(),
})

const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        authId: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        picture: { type: GraphQLString },
    }),
})

const AuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: () => ({
        token: { type: GraphQLString },
        user: { type: UserType },
    }),
})

const MovieType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        directors: { type: GraphQLString },
        year: { type: GraphQLInt },
        rating: { type: GraphQLInt },
        poster_url: { type: GraphQLString },
        user_id: { type: GraphQLInt },
    }),
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: ((): Resolver => () => queries.getAllUsers())(),
        },
        userById: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: ((): Resolver => (_p, args) => queries.getUserById(args.id as string))(),
        },
        userByAuthId: {
            type: UserType,
            args: { authId: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: ((): Resolver => (_p, args) =>
                queries.getUserByAuthId(args.authId as string))(),
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve: ((): Resolver => () => queries.getAllMovies())(),
        },
        movieById: {
            type: MovieType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: ((): Resolver => (_p, args) => queries.getMovieById(args.id as string))(),
        },
        moviesByUserId: {
            type: new GraphQLList(MovieType),
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: ((): Resolver => (_p, args) =>
                queries.getMoviesByUserId(args.id as string))(),
        },
    },
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        register: {
            type: AuthPayloadType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: ((): Resolver =>
                async (_p, args) => {
                    const validated = registerSchema.safeParse(args)
                    if (!validated.success) throw new Error(formatZodError(validated.error))

                    const existing = await queries.getUserByEmail(validated.data.email)
                    if (existing) throw new Error('Email already registered')

                    const password_hash = await bcrypt.hash(validated.data.password, 12)
                    const [user] = await queries.createUser({
                        email: validated.data.email,
                        username: validated.data.username,
                        password_hash,
                        authId: null,
                        picture: null,
                    })
                    const token = signToken({ id: user.id, email: user.email })
                    return { token, user }
                })(),
        },
        login: {
            type: AuthPayloadType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: ((): Resolver =>
                async (_p, args) => {
                    const validated = loginSchema.safeParse(args)
                    if (!validated.success) throw new Error(formatZodError(validated.error))

                    const user = await queries.getUserByEmail(validated.data.email)
                    if (!user || !user.password_hash)
                        throw new Error('Invalid email or password')

                    const valid = await bcrypt.compare(
                        validated.data.password,
                        user.password_hash
                    )
                    if (!valid) throw new Error('Invalid email or password')

                    const token = signToken({ id: user.id, email: user.email })
                    return { token, user }
                })(),
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authId: { type: GraphQLString },
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                picture: { type: GraphQLString },
            },
            resolve: ((): Resolver =>
                async (_p, args, ctx) => {
                    requireAuth(ctx.user)
                    const validated = updateUserSchema.safeParse(args)
                    if (!validated.success) throw new Error(formatZodError(validated.error))
                    const [user] = await queries.updateUser(args.id as string, validated.data)
                    return user
                })(),
        },
        deleteUser: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: ((): Resolver =>
                async (_p, args, ctx) => {
                    requireAuth(ctx.user)
                    const [user] = await queries.deleteUser(args.id as string)
                    return user
                })(),
        },
        deleteAllUsers: {
            type: new GraphQLList(UserType),
            resolve: ((): Resolver =>
                async (_p, _a, ctx) => {
                    requireAuth(ctx.user)
                    return queries.deleteAllUsers()
                })(),
        },
        addMovie: {
            type: MovieType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                directors: { type: new GraphQLNonNull(GraphQLString) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
                rating: { type: new GraphQLNonNull(GraphQLInt) },
                poster_url: { type: new GraphQLNonNull(GraphQLString) },
                user_id: { type: GraphQLInt },
            },
            resolve: ((): Resolver =>
                async (_p, args, ctx) => {
                    const authUser = requireAuth(ctx.user)
                    const validated = addMovieSchema.safeParse(args)
                    if (!validated.success) throw new Error(formatZodError(validated.error))
                    const [movie] = await queries.createMovie({
                        ...validated.data,
                        user_id: authUser.id,
                    })
                    return movie
                })(),
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                directors: { type: new GraphQLNonNull(GraphQLString) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
                rating: { type: new GraphQLNonNull(GraphQLInt) },
                poster_url: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: ((): Resolver =>
                async (_p, args, ctx) => {
                    requireAuth(ctx.user)
                    const validated = updateMovieSchema.safeParse(args)
                    if (!validated.success) throw new Error(formatZodError(validated.error))
                    const [movie] = await queries.updateMovie(args.id as string, validated.data)
                    return movie
                })(),
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: ((): Resolver =>
                async (_p, args, ctx) => {
                    requireAuth(ctx.user)
                    const [movie] = await queries.deleteMovie(args.id as string)
                    return movie
                })(),
        },
        deleteAllMovies: {
            type: new GraphQLList(MovieType),
            resolve: ((): Resolver =>
                async (_p, _a, ctx) => {
                    requireAuth(ctx.user)
                    return queries.deleteAllMovies()
                })(),
        },
    },
})

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})
