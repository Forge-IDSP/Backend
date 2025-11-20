import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
  primaryKey, 
  jsonb,
  text
} from "drizzle-orm/pg-core";

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // Name of the specific badge for querying
  title: varchar("title", { length: 255 }).notNull(), // title of the badge for frontend
  text: varchar("text", { length: 500 }).notNull(), // description of the badge for frontend
  icon: varchar("icon", { length: 50 }).notNull(), // icon name for frontend
});

export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk userId
    badgeId: integer("badge_id")
      .notNull()
      .references(() => badges.id),
    earnedAt: timestamp("earned_at").defaultNow().notNull(), // When badge was earned// referencing badges table
  },
  (table) => {
    return [unique().on(table.userId, table.badgeId)];
  }
);

export const incomeCards = pgTable("income_cards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  level: varchar("level", { length: 100 }).notNull(),
  years: varchar("years", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  progress: integer("progress").notNull(),
  trade: varchar("trade", { length: 50 }).notNull(), // Identifier for frontend payload to fetch all "electrician" incomeCards
});

//  for in-demand jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
});

export const dailyRoutines = pgTable("daily_routines", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  text: varchar("text", { length: 1000 }).notNull(), // daily routine
});

export const jobSkills = pgTable("job_skills", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  skill: varchar("skill", { length: 255 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull(), // "Essential" | "Important" | "Good to Have"
});

export const careerPaths = pgTable("career_paths", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  level: varchar("level", { length: 100 }).notNull(), // "Apprentice" | "Journeyperson" | "Master"
  description: varchar("description", { length: 1000 }).notNull(),
  minIncome: integer("min_income").notNull(),
  income: integer("income").notNull(),
  year: varchar("year", { length: 50 }).notNull(),
  trainingRequired: varchar("training_required", { length: 500 }).notNull(),
  trainingYear: varchar("training_year", { length: 50 }).notNull(),
});

export const pathways = pgTable("pathways", {
    id: text("id").notNull(),
    templateSlug: text("template_slug").notNull(),
    steps: jsonb("steps").notNull(),         
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);

// jobdetail = job + dailyroutines + jobskills + careerpath
export const jobsRelations = relations(jobs, ({ many }) => ({
  dailyRoutines: many(dailyRoutines),
  jobSkills: many(jobSkills),
  careerPaths: many(careerPaths),
}));

export const dailyRoutinesRelations = relations(dailyRoutines, ({ one }) => ({
  job: one(jobs, {
    fields: [dailyRoutines.jobId],
    references: [jobs.id],
  }),
}));

export const jobSkillsRelations = relations(jobSkills, ({ one }) => ({
  job: one(jobs, {
    fields: [jobSkills.jobId],
    references: [jobs.id],
  }),
}));

export const careerPathsRelations = relations(careerPaths, ({ one }) => ({
  job: one(jobs, {
    fields: [careerPaths.jobId],
    references: [jobs.id],
  }),
}));

export const employers = pgTable("employers", {
  id: serial("id").primaryKey(),
  careerName: varchar("career_name", { length: 50 }).notNull(),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  logo: varchar("logo", { length: 255 }),
});
