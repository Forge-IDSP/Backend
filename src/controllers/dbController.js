import { dbService, DbService } from "./dbServices";
export class DbController {
    constructor(dbService) {
        this._dbService = dbService;
    }
    async getBadgesByTrade(c) {
        {
            try {
                const pattern = c.req.query("trade");
                // /badge?trade=
                if (!pattern || pattern.trim() === "") {
                    return c.json({
                        success: false,
                        error: "Search pattern is required",
                        data: null,
                    }, 400);
                }
                const badges = await this._dbService.getBadgesByPattern(pattern);
                return c.json({
                    success: true,
                    badges,
                    error: null,
                }, 200);
            }
            catch (error) {
                console.error("Error in getBadgesByPattern:", error);
                return c.json({
                    success: false,
                    error: "Failed to fetch badges",
                    data: null,
                }, 500);
            }
        }
    }
    async getInDemands(c) {
        try {
            const inDemands = await this._dbService.getAllInDemandJobs();
            return c.json({
                success: true,
                inDemands,
                error: null,
            }, 200);
        }
        catch (error) {
            console.error("Error in getInDemands:", error);
            return c.json({
                success: false,
                error: "Failed to fetch inDemands",
                data: null,
            }, 500);
        }
    }
    async getJobDetailByTitle(c) {
        try {
            const title = c.req.param("title");
            const jobDetail = await this._dbService.getJobDetailByTitle(title);
            return c.json({
                success: true,
                jobDetail,
                error: null,
            }, 200);
        }
        catch (error) {
            console.error("Error in getJobDetails:", error);
            return c.json({
                success: false,
                error: "Failed to fetch getJobDetails",
                data: null,
            }, 500);
        }
    }
    async getDailyJobRoutine(c) {
        try {
            const { careerName } = await c.req.json();
            const jobRoutine = await this._dbService.getDailyJobRoutine(careerName);
            return c.json({
                items: jobRoutine || [],
            });
        }
        catch (error) {
            console.error("Error fetching daily routines:", error);
            return c.json({
                error: "Failed to fetch daily routines",
                items: [],
            }, 500);
        }
    }
    async getEmployers(c) {
        try {
            // For some reason we are not being consistent with how we want to send data :)
            const careerName = c.req.param("careerName");
            const decodedCareerName = decodeURIComponent(careerName);
            const employers = await this._dbService.getEmployers(decodedCareerName);
            return c.json({
                employers,
            });
        }
        catch (error) {
            console.error("Error fetching daily routines:", error);
            return c.json({
                error: "Failed to fetch daily routines",
                items: [],
            }, 500);
        }
    }
}
// Create singleton instance
export const dbController = new DbController(dbService);
