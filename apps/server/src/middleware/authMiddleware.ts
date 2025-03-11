import { Context , Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header("Authorization")
    if (token === "Bearer token") {
        c.set("userid", { name: "John Doe" });
        return next();
    }
    return c.json({ message: "Unauthorized" }, 401);
}