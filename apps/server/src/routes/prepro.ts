import { Hono } from "hono";
import { Variables } from "..";
import { requestId } from 'hono/request-id'

export const preproRoute = new Hono<{ Bindings: Env, Variables: Variables }>()
preproRoute.use(requestId())
    .get("/upload", async (c) => {
        try {
            const body = await c.req.parseBody()
            const file: File | string = body['file']
            const storage = c.env.BUCKET
            if (file instanceof File) {
                console.log(file);

                const res = await storage.put("prepro/" + c.get("requestId") + file.name, file)
                console.log(res);

                return c.json({ "path": "prepro/" + c.get("requestId") + file.name });
            }
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    }
    )
    .get("/file/:path", async (c) => {
        try {
            const path = c.req.param("path")
            const storage = c.env.BUCKET
            const res = await storage.get(path)
            return c.json(res)
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    }


    )