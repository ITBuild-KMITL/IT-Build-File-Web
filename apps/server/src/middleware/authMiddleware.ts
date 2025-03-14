import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";

export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
        const token = await getCookie(c, "accessToken") || c.req.header("Authorization")?.split(" ")[1];

        if (!token) {
            throw new Error("Unauthorized");
        }

        const payload = await verify(token, c.env.JWT_SECRET);

        c.set("jwtPayload", payload);
        return next()
    }
    catch (e) {
        if (e instanceof Error) {
            return c.json({ error: e.message }, 401);
        }
        ``
    }

}