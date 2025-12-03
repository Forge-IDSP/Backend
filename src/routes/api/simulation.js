import { Hono } from "hono";
import { dbController } from "../../controllers/dbController";
import { aiController } from "../../controllers/aiController";
export const simulationRoute = new Hono();
simulationRoute.post("/jobRoutine", async (c) => {
    return await dbController.getDailyJobRoutine(c);
});
simulationRoute.get("/employers/:careerName", async (c) => {
    return await dbController.getEmployers(c);
});
simulationRoute.get("/apprentice-levels/:careerName", async (c) => {
    return await aiController.getApprenticeLevels(c);
});
