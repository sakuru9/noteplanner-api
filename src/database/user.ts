import argon from "argon2";
import { dbClient } from "./index";

const createUserQ = `INSERT INTO "user" (email, password) VALUES($1, $2) RETURNING id, email`;
const findUserByEmailQ = `SELECT * FROM "user" WHERE email = $1 `;

const hashPassword = (password: string) => argon.hash(password);

const storeUser = async (email: string, password: string) =>
  await dbClient(async (client) =>
    client.query(createUserQ, [email, await hashPassword(password)])
  );

export const createUser = async (
  email: string,
  password: string
): Promise<any> =>
  storeUser(email, password)
    .then((res) => res.rows)
    .catch((e) => e);

export const userByEmail = async (email: string) =>
  await dbClient(async (client) =>
    client
      .query(findUserByEmailQ, [email])
      .then((res) => res.rows[0])
      .catch((e) => e)
  );
