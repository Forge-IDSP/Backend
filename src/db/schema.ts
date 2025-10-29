import { pgTable, serial, varchar, integer,unique,timestamp } from "drizzle-orm/pg-core";

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // Name of the specific badge for querying
  title: varchar("title", { length: 255 }).notNull(), // title of the badge for frontend
  text: varchar("text", { length: 500 }).notNull(), // description of the badge for frontend
  icon: varchar("icon", { length: 50 }).notNull(), // icon name for frontend
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk userId
  badgeId: integer("badge_id").notNull().references(() => badges.id), 
  earnedAt: timestamp("earned_at").defaultNow().notNull(), // When badge was earned// referencing badges table
}, (table) => {
  return [
    unique().on(table.userId, table.badgeId),
  ]
});

export const incomeCards = pgTable("income_cards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  level: varchar("level", { length: 100 }).notNull(),
  years: varchar("years", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  progress: integer("progress").notNull(),
  trade: varchar("trade", { length: 50 }).notNull(), // Identifier for frontend payload to fetch all "electrician" incomeCards
});