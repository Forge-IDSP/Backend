// controllers/TradeController.ts
import { dbService, DbService } from "./dbServices";
import type { Context } from "hono";
export class DbController {
  private _dbService: DbService;

  constructor(dbService: DbService) {
    this._dbService = dbService;
  }

  public async getBadgesByTrade(c:Context) { {
    try {
      const pattern = c.req.query("trade");
      
      if (!pattern || pattern.trim() === "") {
        return c.json({
          success: false,
          error: "Search pattern is required",
          data: null
        }, 400);
      }

      const badges = await this._dbService.getBadgesByPattern(pattern);
      return c.json({
        success: true,
        badges,
        error: null
      }, 200);
    } catch (error) {
      console.error("Error in getBadgesByPattern:", error);
      return c.json({
        success: false,
        error: "Failed to fetch badges",
        data: null
      }, 500);
    }
  }


  }


}

// Create singleton instance
export const dbController = new DbController(dbService);