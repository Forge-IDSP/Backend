import { desc, eq, like } from "drizzle-orm";
import type {
  CareerPath,
  JobDetail,
  SkillLevel,
  UserBadge,
} from "../../types/types";
import { db, schema, type Database } from "../db/client";
export class DbService {
  private _database: Database;

  constructor(dbConnection: Database) {
    this._database = dbConnection;
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
}

export const dbService = new DbService(db);

// console.log(await dbService.getBadgesByPattern("electrician"));

// console.log(await dbService.getIncomeCardsByTrade("electrician"));
