import { Hono } from "hono";
import { requestId } from 'hono/request-id'
import { authMiddleware } from "../middleware/authMiddleware";
import { drizzle } from "drizzle-orm/d1";
import { storageTable } from "../../db/schema/storage";
import { desc, eq } from "drizzle-orm";

export const userFileRoute = new Hono<{ Bindings: Env }>()
    .use(requestId())
    .get("/list", authMiddleware, async (c) => { 
        try {
            const perPage = parseInt(c.req.param("perPage") || "10")
            const page = parseInt(c.req.param("page") || "1")
            const db = drizzle(c.env.DB)
            const files = await db.select()
                .from(storageTable)
                .where(eq(storageTable.accountId, c.get("jwtPayload").sub))
                .orderBy(desc(storageTable.createdAt))
                .limit(perPage)
                .offset((page - 1) * perPage)
            return c.json({data:files});
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .get("/path/:path", async (c) => {
        try {
            const storage = c.env.BUCKET
            const path = c.req.param("path")
            const res = await storage.get(path)
            if (!res) {
                return c.json({ message: "File not found" }, 404);
            }
            return c.body(res?.body);
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .post("/", authMiddleware, async (c) => {
        try {
            const body = await c.req.parseBody()
            const file: File | string = body['file']
            const storage = c.env.BUCKET
            const db = drizzle(c.env.DB)
            if (file instanceof File) {
                const path = "user-" + c.get("requestId") + file.name
                const res = await storage.put(path, file)
                await db.insert(storageTable).values({
                    accountId: c.get("jwtPayload").sub,
                    fileName: file.name,
                    path
                })
                return c.json({ path });
            }
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .delete("/:id", authMiddleware, async (c) => {
        try {
            const storage = c.env.BUCKET
            const db = drizzle(c.env.DB)
            const id = c.req.param("id")
            const filePath = await db.select().from(storageTable).where(eq(storageTable.id, parseInt(id)))
            if (filePath.length === 0) {
                throw new Error("File not found")
            }
            const path = filePath[0].path
            const res = await storage.delete(path)
            await db.update(storageTable).set({ deletedAt: new Date() }).where(eq(storageTable.id, parseInt(id)))
            return c.json({ message: "File deleted" });
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })