import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";
import { drizzle } from "drizzle-orm/d1";
import { accountTable, usersTable } from "../../db/db";
import { eq } from "drizzle-orm";

export const accountRoute = new Hono<{ Bindings: Env }>()
    .use(authMiddleware)
    .get("/", async (c) => {
        try {
            const db = drizzle(c.env.DB)
            const account = await db.select().from(accountTable).where(eq(accountTable.id, c.get("jwtPayload").sub)).leftJoin(usersTable, eq(accountTable.id, usersTable.accountId))
            if (!account.length) {
                throw new Error("Account not found")
            }
            const data = account[0]
            return c.json({ ...data });
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 400);
        }
    }
    )