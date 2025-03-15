import { Context } from "hono";

export const corsMiddleware = async (
    c: Context<{ Bindings: Env }>,
    next: () => Promise<void>
) => {
    const origin = c.req.header('Origin') || '*';

    // เพิ่ม headers สำหรับ CORS
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    c.header('Access-Control-Expose-Headers', 'Content-Length, X-File-Size');
    c.header('Access-Control-Max-Age', '86400');

    // จัดการกับ preflight request
    if (c.req.method === 'OPTIONS') {
        return c.text('');
    }

    return next();
}