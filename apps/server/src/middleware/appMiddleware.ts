import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { appTable } from "../../db/db";
import { eq } from "drizzle-orm";

export const appMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
        const db = drizzle(c.env.DB);

        const token = await getCookie(c, "botToken") || c.req.header("Authorization")?.split(" ")[1];

        if (!token) {
            throw new Error("Unauthorized");
        }

        const appAuth = await db.select().from(appTable).where(eq(appTable.token, token));

        if (appAuth.length === 0) {
            throw new Error("Unauthorized");
        }

        const payload = {
            sub: appAuth[0].id,
        }
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