import { Context } from "hono";

export const corsMiddleware = async (
    c: Context<{ Bindings: Env }>,
    next: () => Promise<void>
) => {
    const origin = c.req.header('Origin') || '*'

    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
    c.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '86400')

    return next()
}