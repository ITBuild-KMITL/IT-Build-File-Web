import { Hono } from 'hono'
import { googleAuthRoute } from './routes/googleAuthRoute';
import { corsMiddleware } from './middleware/corsMiddleware';
import { userFileRoute } from './routes/userFileRoute';
import { accountRoute } from './routes/accountRoute';

export interface Variables {
  userid:String
}

const app = new Hono<{Bindings:Env, Variables : Variables}>()

app.use('/*', corsMiddleware)

app.route('/auth/google', googleAuthRoute)
app.route('/file', userFileRoute)
app.route('/@me',accountRoute)

export default app
