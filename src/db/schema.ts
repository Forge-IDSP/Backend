import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const test = pgTable("test", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
});
