import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1';

const app = new Hono<{Bindings:Env}>()


app.get('/', async(c) => {
  return c.json({ message: 'Hello World' })
})

app.post('/', async(c) => {
  const formData = c.req.formData()
  const db = drizzle(c.env.DB)
  const storage = c.env.BUCKET
  const file = (await formData).get("file") as File
  try{
    const res = await storage.put(file.name,file);
    return c.json({ message: res })
  }
  catch(e){
    console.log(e);
  }
  
  return c.json({ message: c.env.DB })
})

export default app
