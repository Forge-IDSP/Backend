"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myPathwayBadgesRelations = exports.myPathwaysRelations = exports.employers = exports.careerPathsRelations = exports.jobSkillsRelations = exports.dailyRoutinesRelations = exports.jobsRelations = exports.myPathwayBadges = exports.myPathways = exports.pathways = exports.careerPaths = exports.jobSkills = exports.dailyRoutines = exports.jobs = exports.incomeCards = exports.userBadges = exports.badges = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.badges = (0, pg_core_1.pgTable)("badges", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull().unique(), // Name of the specific badge for querying
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(), // title of the badge for frontend
    text: (0, pg_core_1.varchar)("text", { length: 500 }).notNull(), // description of the badge for frontend
    icon: (0, pg_core_1.varchar)("icon", { length: 50 }).notNull(), // icon name for frontend
});
exports.userBadges = (0, pg_core_1.pgTable)("user_badges", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull(), // Clerk userId
    badgeId: (0, pg_core_1.integer)("badge_id")
        .notNull()
        .references(() => exports.badges.id),
    earnedAt: (0, pg_core_1.timestamp)("earned_at").defaultNow().notNull(), // When badge was earned// referencing badges table
}, (table) => {
    return [(0, pg_core_1.unique)().on(table.userId, table.badgeId)];
});
exports.incomeCards = (0, pg_core_1.pgTable)("income_cards", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }),
    level: (0, pg_core_1.varchar)("level", { length: 100 }).notNull(),
    years: (0, pg_core_1.varchar)("years", { length: 50 }).notNull(),
    amount: (0, pg_core_1.integer)("amount").notNull(),
    progress: (0, pg_core_1.integer)("progress").notNull(),
    trade: (0, pg_core_1.varchar)("trade", { length: 50 }).notNull(), // Identifier for frontend payload to fetch all "electrician" incomeCards
});
//  for in-demand jobs
exports.jobs = (0, pg_core_1.pgTable)("jobs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 1000 }).notNull(),
    icon: (0, pg_core_1.varchar)("icon", { length: 50 }).notNull(),
});
exports.dailyRoutines = (0, pg_core_1.pgTable)("daily_routines", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    jobId: (0, pg_core_1.integer)("job_id")
        .notNull()
        .references(() => exports.jobs.id),
    text: (0, pg_core_1.varchar)("text", { length: 1000 }).notNull(), // daily routine
});
exports.jobSkills = (0, pg_core_1.pgTable)("job_skills", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    jobId: (0, pg_core_1.integer)("job_id")
        .notNull()
        .references(() => exports.jobs.id),
    skill: (0, pg_core_1.varchar)("skill", { length: 255 }).notNull(),
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).notNull(), // "Essential" | "Important" | "Good to Have"
});
exports.careerPaths = (0, pg_core_1.pgTable)("career_paths", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    jobId: (0, pg_core_1.integer)("job_id")
        .notNull()
        .references(() => exports.jobs.id),
    level: (0, pg_core_1.varchar)("level", { length: 100 }).notNull(), // "Apprentice" | "Journeyperson" | "Master"
    description: (0, pg_core_1.varchar)("description", { length: 1000 }).notNull(),
    minIncome: (0, pg_core_1.integer)("min_income").notNull(),
    income: (0, pg_core_1.integer)("income").notNull(),
    year: (0, pg_core_1.varchar)("year", { length: 50 }).notNull(),
    trainingRequired: (0, pg_core_1.varchar)("training_required", { length: 500 }).notNull(),
    trainingYear: (0, pg_core_1.varchar)("training_year", { length: 50 }).notNull(),
});
exports.pathways = (0, pg_core_1.pgTable)("pathways", {
    id: (0, pg_core_1.text)("id").notNull(),
    templateSlug: (0, pg_core_1.text)("template_slug").notNull(),
    steps: (0, pg_core_1.jsonb)("steps").$type().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
    }).notNull(),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.id] }),
}));
exports.myPathways = (0, pg_core_1.pgTable)("my_pathways", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull(), // Clerk userId
    templateId: (0, pg_core_1.text)("template_id").references(() => exports.pathways.id),
    // UI fields
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    aiSummary: (0, pg_core_1.text)("ai_summary"),
    aiShortLabel: (0, pg_core_1.varchar)("ai_short_label", { length: 150 }),
    steps: (0, pg_core_1.jsonb)("steps").$type().notNull(),
    aiData: (0, pg_core_1.jsonb)("ai_data").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.id] }),
    // only one pathway per title
    uniqUserTitle: (0, pg_core_1.unique)().on(table.userId, table.title),
}));
exports.myPathwayBadges = (0, pg_core_1.pgTable)("my_pathway_badges", {
    pathwayId: (0, pg_core_1.integer)("pathway_id")
        .notNull()
        .references(() => exports.myPathways.id, { onDelete: "cascade" }),
    badgeId: (0, pg_core_1.integer)("badge_id")
        .notNull()
        .references(() => exports.badges.id, { onDelete: "cascade" }),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.pathwayId, table.badgeId] }),
}));
// jobdetail = job + dailyroutines + jobskills + careerpath
exports.jobsRelations = (0, drizzle_orm_1.relations)(exports.jobs, ({ many }) => ({
    dailyRoutines: many(exports.dailyRoutines),
    jobSkills: many(exports.jobSkills),
    careerPaths: many(exports.careerPaths),
}));
exports.dailyRoutinesRelations = (0, drizzle_orm_1.relations)(exports.dailyRoutines, ({ one }) => ({
    job: one(exports.jobs, {
        fields: [exports.dailyRoutines.jobId],
        references: [exports.jobs.id],
    }),
}));
exports.jobSkillsRelations = (0, drizzle_orm_1.relations)(exports.jobSkills, ({ one }) => ({
    job: one(exports.jobs, {
        fields: [exports.jobSkills.jobId],
        references: [exports.jobs.id],
    }),
}));
exports.careerPathsRelations = (0, drizzle_orm_1.relations)(exports.careerPaths, ({ one }) => ({
    job: one(exports.jobs, {
        fields: [exports.careerPaths.jobId],
        references: [exports.jobs.id],
    }),
}));
exports.employers = (0, pg_core_1.pgTable)("employers", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    careerName: (0, pg_core_1.varchar)("career_name", { length: 50 }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 50 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 500 }).notNull(),
    logo: (0, pg_core_1.varchar)("logo", { length: 255 }),
});
exports.myPathwaysRelations = (0, drizzle_orm_1.relations)(exports.myPathways, ({ many }) => ({
    badges: many(exports.myPathwayBadges),
}));
exports.myPathwayBadgesRelations = (0, drizzle_orm_1.relations)(exports.myPathwayBadges, ({ one }) => ({
    pathway: one(exports.myPathways, {
        fields: [exports.myPathwayBadges.pathwayId],
        references: [exports.myPathways.id],
    }),
    badge: one(exports.badges, {
        fields: [exports.myPathwayBadges.badgeId],
        references: [exports.badges.id],
    }),
}));
