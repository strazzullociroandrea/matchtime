import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { subscriptions } from "@/lib/schemas/db-schema";
import { env } from "@/env";

const cleanUrl = env.POSTGRES_URL;

const queryClient = postgres(cleanUrl, {
  max: 10,
});

export const db = drizzle(queryClient, {
  schema: { subscriptions },
});
