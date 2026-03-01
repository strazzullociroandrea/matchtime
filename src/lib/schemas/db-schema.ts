import { mysqlTable, serial, varchar, text } from "drizzle-orm/mysql-core";

export const subscriptions = mysqlTable("subscription", {
  id: serial("id").primaryKey(),
  endpoint: varchar("endpoint", { length: 255 }).notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
});
