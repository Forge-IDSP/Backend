"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = exports.DbService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const redis_1 = require("redis");
class DbService {
    constructor(dbConnection, redisServer) {
        this._database = dbConnection;
        this._redis = (0, redis_1.createClient)({ url: redisServer });
    }
    //public methods
    async awardBadge(userId, badgeName) {
        // Need userId and BadgeName to award.
        try {
            const badge = await this.getBadgeByName(badgeName);
            if (!badge) {
                throw new Error(`Badge ${badgeName} not found`);
            }
            // give user the badge we fetched from DB
            await this._database
                .insert(client_1.schema.userBadges)
                .values({
                userId,
                badgeId: badge.id,
            })
                .onConflictDoNothing();
            return { success: true };
        }
        catch (error) {
            console.error("Error awarding badge:", error);
            return { success: false, error };
        }
    }
    async getAllUserBadges(userId) {
        return await this._database
            .select({
            title: client_1.schema.badges.title,
            text: client_1.schema.badges.text,
            icon: client_1.schema.badges.icon,
        })
            .from(client_1.schema.userBadges)
            .innerJoin(client_1.schema.badges, (0, drizzle_orm_1.eq)(client_1.schema.userBadges.badgeId, client_1.schema.badges.id))
            .where((0, drizzle_orm_1.eq)(client_1.schema.userBadges.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(client_1.schema.userBadges.earnedAt));
    }
    async getBadgesByPattern(badgeNamePattern) {
        const badges = await this._database
            .select({
            title: client_1.schema.badges.title,
            text: client_1.schema.badges.text,
            icon: client_1.schema.badges.icon,
        })
            .from(client_1.schema.badges)
            .where((0, drizzle_orm_1.like)(client_1.schema.badges.name, `%${badgeNamePattern}%`));
        return badges;
    }
    async getIncomeCardsByTrade(tradeName) {
        return await this._database
            .select({
            title: client_1.schema.incomeCards.title,
            level: client_1.schema.incomeCards.level,
            years: client_1.schema.incomeCards.years,
            amount: client_1.schema.incomeCards.amount,
            progress: client_1.schema.incomeCards.progress,
        })
            .from(client_1.schema.incomeCards)
            .where((0, drizzle_orm_1.eq)(client_1.schema.incomeCards.trade, tradeName));
    }
    //Private helper methods
    async getBadgeByName(badgeName) {
        const result = await this._database
            .select({
            id: client_1.schema.badges.id,
            title: client_1.schema.badges.title,
            text: client_1.schema.badges.text,
            icon: client_1.schema.badges.icon,
        })
            .from(client_1.schema.badges)
            .where((0, drizzle_orm_1.eq)(client_1.schema.badges.name, badgeName))
            .limit(1);
        return result[0] || null;
    }
    // in-demands jobs list
    async getAllInDemandJobs() {
        return await this._database
            .select({
            title: client_1.schema.jobs.title,
            description: client_1.schema.jobs.description,
            icon: client_1.schema.jobs.icon,
        })
            .from(client_1.schema.jobs);
    }
    async getJobDetailByTitle(title) {
        // if (!title) return nul;
        if (!title)
            return null;
        const job = await this._database.query.jobs.findFirst({
            where: (jobs, { eq }) => eq(jobs.title, title),
            with: {
                dailyRoutines: true,
                jobSkills: true,
                careerPaths: true,
            },
        });
        if (!job)
            return null;
        const jobDetail = {
            id: job.id,
            title: job.title,
            description: job.description,
            icon: job.icon,
            dailyRoutines: job.dailyRoutines.map((r) => r.text),
            skillsRequired: job.jobSkills.map((s) => ({
                skill: s.skill,
                priority: s.priority,
            })),
            careerPath: job.careerPaths.map((c) => ({
                level: c.level,
                description: c.description,
                minIncome: c.minIncome,
                income: c.income,
                year: c.year,
                trainingRequired: c.trainingRequired,
                trainingYear: c.trainingYear,
            })),
        };
        return jobDetail;
    }
    async getDailyJobRoutine(career) {
        try {
            const decodedCareer = decodeURIComponent(career);
            const jobResult = await this._database
                .select()
                .from(client_1.schema.jobs)
                .where((0, drizzle_orm_1.eq)(client_1.schema.jobs.title, decodedCareer))
                .limit(1);
            const job = jobResult[0];
            if (!job) {
                console.log(`No job found for career: ${career}`);
                return [];
            }
            const routines = await this._database
                .select({
                text: client_1.schema.dailyRoutines.text,
            })
                .from(client_1.schema.dailyRoutines)
                .where((0, drizzle_orm_1.eq)(client_1.schema.dailyRoutines.jobId, job.id));
            return routines.map((routine) => routine.text);
        }
        catch (error) {
            console.error(`Error fetching daily routines for ${career}:`, error);
            return [];
        }
    }
    async getEmployers(career) {
        try {
            const employers = await this._database
                .select({
                id: client_1.schema.employers.id,
                title: client_1.schema.employers.title,
                description: client_1.schema.employers.description,
                logo: client_1.schema.employers.logo,
            })
                .from(client_1.schema.employers)
                .where((0, drizzle_orm_1.eq)(client_1.schema.employers.careerName, career.toLowerCase()));
            return employers.map((emp) => ({
                id: emp.id,
                title: emp.title,
                description: emp.description,
                logo: emp.logo || undefined,
            }));
        }
        catch (error) {
            console.error(`Error fetching employers for ${career}:`, error);
            return [];
        }
    }
}
exports.DbService = DbService;
exports.dbService = new DbService(client_1.db, process.env.REDIS_SERVER);
// console.log(await dbService.getBadgesByPattern("electrician"));
// console.log(await dbService.getIncomeCardsByTrade("electrician"));
// console.log(await dbService.getIncomeCardsByTrade("electrician"));
