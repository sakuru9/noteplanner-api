import pg, { PoolClient } from "pg";
require("dotenv").config();

// TODO use envs
const connPool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "notedb",
  password: "postgres",
  port: 5432,
});

export const initDB = async () =>
  await dbClient(
    async (client) =>
      await client.query(`
        CREATE TABLE IF NOT EXISTS "user" (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),email text UNIQUE NOT NULL, PASSWORD text NOT NULL);  
`)
  );

export const dbClient = async <T>(cl: (client: PoolClient) => Promise<T>) => {
  const client = await connPool.connect();
  try {
    return cl(client);
  } finally {
    client.release();
  }
};
