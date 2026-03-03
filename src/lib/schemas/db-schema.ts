import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscription", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
});
