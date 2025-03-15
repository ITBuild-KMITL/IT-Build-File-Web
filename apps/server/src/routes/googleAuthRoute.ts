import { Context, Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { count, eq, is } from "drizzle-orm";
import { GoogleUserData } from "../../interface/auth/google";
import { accountTable, usersTable } from "../../db/db";
import { jwt, sign } from "hono/jwt";
import { log } from "console";
import { setCookie } from "hono/cookie";
import axios from "axios";

export const googleAuthRoute = new Hono<{ Bindings: Env }>()
    .get("/", (c) => {
        const env: Env = c.env;
        const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
        const GOOGLE_REDIRECT_URI = env.BACKEND_URL + '/auth/google/callback';
        const responseType = 'code';
        const scopesArray = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        const scope = encodeURIComponent(scopesArray.join(' '));
        const accessType = 'offline';

        const authUrl = `${GOOGLE_AUTH_ENDPOINT}?response_type=${responseType}&client_id=${encodeURIComponent(c.env.GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&scope=${scope}&access_type=${accessType}`;
        return c.redirect(authUrl);
    })

    .get("/callback", async (c) => {
        const code = c.req.query("code")
        // return c.json({ code });
        const db = drizzle(c.env.DB);

        try {
            const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

            if (!code) {
                throw new Error('No code provided');
            }

            const tokenResponse = await axios.post(GOOGLE_TOKEN_ENDPOINT,
                new URLSearchParams({
                    code: code,
                    client_id: c.env.GOOGLE_CLIENT_ID,
                    client_secret: c.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: c.env.BACKEND_URL + '/auth/google/callback',
                    grant_type: 'authorization_code',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const tokenData: { access_token: string } = await tokenResponse.data;
            const accessToken = tokenData.access_token;

            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const userData: GoogleUserData = await response.json();

            return c.json({ userData });

            const isExited = await db.select({ count: count(), id: accountTable.id }).from(accountTable).where(eq(accountTable.googleId, userData.sub));

            let userid = isExited[0].id;

            if (isExited[0].count == 0) {
                const createdAccount = await db.insert(accountTable).values({
                    googleId: userData.sub,
                }).returning()

                const createdUser = await db.insert(usersTable).values({
                    accountId: createdAccount[0].id,
                    email: userData.email,
                    firstName: userData.given_name,
                    lastName: userData.family_name,
                    userProfileURL: userData.picture,
                }).returning()

                userid = createdUser[0].id;
            }

            const payload = {
                sub: userid,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                iat: Math.floor(Date.now() / 1000),
            };

            const jwt = await sign(payload, c.env.JWT_SECRET);
            c.status(200);

            setCookie(c, 'accessToken', jwt, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 60 * 24 * 30,
            })

            return c.redirect(c.env.FRONTEND_URL + '/profile');
        }


        catch (e) {
            if (e instanceof Error) {
                c.status(400);
                return c.json({ error: e.message });
            }
            console.log(e)
        }
    }
    )