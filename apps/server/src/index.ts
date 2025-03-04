import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1';

const app = new Hono<{Bindings:Env}>()


app.get('/', (c) => {
  const db = drizzle(c.env.DB)
  console.log(db);
  
  return c.json({ message: c.env.DB })
})

export default app
