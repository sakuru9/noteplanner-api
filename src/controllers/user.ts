import { Response, Request } from "express";
import argon from "argon2";
import { createUser, userByEmail } from "../database/user";

interface User {
  id: string;
  email: string;
  password: string;
}

interface Context {
  req: Request & {};
  res: Response;
}

const user = async ({ req, res }: Context) =>
  await createUser(req.body.email, req.body.password)
    .then((r) => res.status(200).json(r))
    .catch(() => res.status(400));

const login = async (req: Request, res: Response) =>
  userByEmail(req.body.email)
    .then(async (u) => await verifyAuth(u, req.body.password))
    .then((r) =>
      r
        ? (req.session.userId = r?.id)
        : res.status(401).json({ success: false })
    )
    .then(() => res.status(200).json({ success: true }))
    .catch(() => res.status(400));

const verifyAuth = async (u: User, plainPass: string): Promise<User | null> =>
  (await argon.verify(u.password, plainPass)) ? u : null;

export { user, login };
