import mysql from "mysql2/promise";
import { subscriptions } from "@/lib/schemas/db-schema";
import { env } from "@/env";
import { drizzle } from "drizzle-orm/mysql2";

const cleanUrl = env.URL_DB.replace(/^["'](.+)["']$/, "$1");

const connection = mysql.createPool({
  uri: cleanUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection, {
  schema: { subscriptions },
  mode: "default",
});
