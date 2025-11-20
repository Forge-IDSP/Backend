import { desc, eq, like, sql } from "drizzle-orm";
import type {
  CareerPath,
  Employer,
import { desc, eq, like } from "drizzle-orm";
import type {
  CareerPath,
  JobDetail,
  SkillLevel,
  UserBadge,
} from "../../types/types";
import { db, schema, type Database } from "../db/client";
import { createClient } from "redis";
import type { RedisClientType } from "redis";

export class DbService {
  private _database: Database;
  private _redis: RedisClientType;

  constructor(dbConnection: Database, redisServer: string) {
    this._database = dbConnection;
    this._redis = createClient({ url: redisServer });
  }
  //public methods
  public async awardBadge(userId: string, badgeName: string) {
    // Need userId and BadgeName to award.
    try {
      const badge = await this.getBadgeByName(badgeName);

      if (!badge) {
        throw new Error(`Badge ${badgeName} not found`);
      }

      // give user the badge we fetched from DB
      await this._database
        .insert(schema.userBadges)
        .values({
          userId,
          badgeId: badge.id,
        })
        .onConflictDoNothing();
      return { success: true };
    } catch (error) {
      console.error("Error awarding badge:", error);
      return { success: false, error };
    }
  }

  public async getAllUserBadges(userId: string): Promise<UserBadge[]> {
    return await this._database
      .select({
        title: schema.badges.title,
        text: schema.badges.text,
        icon: schema.badges.icon,
      })
      .from(schema.userBadges)
      .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
      .where(eq(schema.userBadges.userId, userId))
      .orderBy(desc(schema.userBadges.earnedAt));
  }
  public async getBadgesByPattern(badgeNamePattern: string) {
    const badges = await this._database
      .select({
        title: schema.badges.title,
        text: schema.badges.text,
        icon: schema.badges.icon,
      })
      .from(schema.badges)
      .where(like(schema.badges.name, `%${badgeNamePattern}%`));
    return badges;
  }
  public async getIncomeCardsByTrade(tradeName: string) {
    return await this._database
      .select({
        title: schema.incomeCards.title,
        level: schema.incomeCards.level,
        years: schema.incomeCards.years,
        amount: schema.incomeCards.amount,
        progress: schema.incomeCards.progress,
      })
      .from(schema.incomeCards)
      .where(eq(schema.incomeCards.trade, tradeName));
  }

  //Private helper methods
  private async getBadgeByName(badgeName: string) {
    const result = await this._database
      .select({
        id: schema.badges.id,
        title: schema.badges.title,
        text: schema.badges.text,
        icon: schema.badges.icon,
      })
      .from(schema.badges)
      .where(eq(schema.badges.name, badgeName))
      .limit(1);
    return result[0] || null;
  }
  // in-demands jobs list
  public async getAllInDemandJobs() {
    return await this._database
      .select({
        title: schema.jobs.title,
        description: schema.jobs.description,
        icon: schema.jobs.icon,
      })
      .from(schema.jobs);
  }

  public async getJobDetailByTitle(title: string): Promise<JobDetail | null> {
    // if (!title) return nul;
    if (!title) return null;

    const job = await this._database.query.jobs.findFirst({
      where: (jobs, { eq }) => eq(jobs.title, title),
      with: {
        dailyRoutines: true,
        jobSkills: true,
        careerPaths: true,
      },
    });

    if (!job) return null;
    const jobDetail: JobDetail = {
      id: job.id,
      title: job.title,
      description: job.description,
      icon: job.icon,
      dailyRoutines: job.dailyRoutines.map((r) => r.text),
      skillsRequired: job.jobSkills.map(
        (s): SkillLevel => ({
          skill: s.skill,
          priority: s.priority as SkillLevel["priority"],
        })
      ),
      careerPath: job.careerPaths.map(
        (c): CareerPath => ({
          level: c.level as CareerPath["level"],
          description: c.description,
          minIncome: c.minIncome,
          income: c.income,
          year: c.year,
          trainingRequired: c.trainingRequired,
          trainingYear: c.trainingYear,
        })
      ),
    };

    return jobDetail;
  }
  public async getDailyJobRoutine(career: string): Promise<string[]> {
    try {
      const decodedCareer = decodeURIComponent(career);

      const jobResult = await this._database
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.title, decodedCareer))
        .limit(1);

      const job = jobResult[0];

      if (!job) {
        console.log(`No job found for career: ${career}`);
        return [];
      }
      const routines = await this._database
        .select({
          text: schema.dailyRoutines.text,
        })
        .from(schema.dailyRoutines)
        .where(eq(schema.dailyRoutines.jobId, job.id));

      return routines.map((routine) => routine.text);
    } catch (error) {
      console.error(`Error fetching daily routines for ${career}:`, error);
      return [];
    }
  }
  public async getEmployers(career: string): Promise<Employer[]> {
    try {
      const employers = await this._database
        .select({
          id: schema.employers.id,
          title: schema.employers.title,
          description: schema.employers.description,
          logo: schema.employers.logo,
        })
        .from(schema.employers)
        .where(eq(schema.employers.careerName, career.toLowerCase()));

      return employers.map((emp) => ({
        id: emp.id,
        title: emp.title,
        description: emp.description,
        logo: emp.logo || undefined,
      }));
    } catch (error) {
      console.error(`Error fetching employers for ${career}:`, error);
      return [];
    }
  }
}

export const dbService = new DbService(db, process.env.REDIS_SERVER!);

// console.log(await dbService.getBadgesByPattern("electrician"));

// console.log(await dbService.getIncomeCardsByTrade("electrician"));
console.log(await dbService.getIncomeCardsByTrade("electrician"));
