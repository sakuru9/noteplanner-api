import express from "express";
import { home, user, login } from "./controllers";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
const app: express.Application = express();

app.use(
  session({
    name: "jid",
    store: new RedisStore({ client: redisClient, disableTouch: true }),
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      //secure: true
    },
    secret: process.env.sessionSecret as string,
    resave: false,
  })
);

app.use(express.json());

app.get("/", home);
app.post("/users", user);
app.post("/users/login", login);

export { app };
