import { Hono } from 'hono'

const app = new Hono<{Bindings:Env}>()


app.get('/', (c) => {
  return c.json({ message: c.env.DB })
})

export default app
