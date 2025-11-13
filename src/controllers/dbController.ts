// controllers/TradeController.ts
import type { Context } from "hono";
import { dbService, DbService } from "./dbServices";
export class DbController {
  private _dbService: DbService;

  constructor(dbService: DbService) {
    this._dbService = dbService;
  }

  public async getBadgesByTrade(c: Context) {
    {
      try {
        const pattern = c.req.query("trade");
        // /badge?trade=
        if (!pattern || pattern.trim() === "") {
          return c.json(
            {
              success: false,
              error: "Search pattern is required",
              data: null,
            },
            400
          );
        }

        const badges = await this._dbService.getBadgesByPattern(pattern);
        return c.json(
          {
            success: true,
            badges,
            error: null,
          },
          200
        );
      } catch (error) {
        console.error("Error in getBadgesByPattern:", error);
        return c.json(
          {
            success: false,
            error: "Failed to fetch badges",
            data: null,
          },
          500
        );
      }
    }
  }

  public async getInDemands(c: Context) {
    try {
      const inDemands = await this._dbService.getAllInDemandJobs();
      return c.json(
        {
          success: true,
          inDemands,
          error: null,
        },
        200
      );
    } catch (error) {
      console.error("Error in getInDemands:", error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch inDemands",
          data: null,
        },
        500
      );
    }
  }

  public async getJobDetailByTitle(c: Context) {
    try {
      const title = c.req.param("title");
      const jobDetail = await this._dbService.getJobDetailByTitle(title);
      return c.json(
        {
          success: true,
          jobDetail,
          error: null,
        },
        200
      );
    } catch (error) {
      console.error("Error in getJobDetails:", error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch getJobDetails",
          data: null,
        },
        500
      );
    }
  }

  public async getAllEmployersByCareerName(c: Context) {
    try {
      const careerName = c.req.param("careerName");
      if (!careerName) return;
      const trim = String(careerName).trim();
      const employers = await this._dbService.getAllEmployersByCareerName(trim);
      return c.json(
        {
          success: true,
          employers,
          error: null,
        },
        200
      );
    } catch (error) {
      console.log("Error in getEmployerByCareerName:", error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch employers",
          data: null,
        },
        500
      );
    }
  }
}

// Create singleton instance
export const dbController = new DbController(dbService);
