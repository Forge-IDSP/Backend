"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulationRoute = void 0;
const hono_1 = require("hono");
const dbController_1 = require("../../controllers/dbController");
const aiController_1 = require("../../controllers/aiController");
exports.simulationRoute = new hono_1.Hono();
exports.simulationRoute.post("/jobRoutine", async (c) => {
    return await dbController_1.dbController.getDailyJobRoutine(c);
});
exports.simulationRoute.get("/employers/:careerName", async (c) => {
    return await dbController_1.dbController.getEmployers(c);
});
exports.simulationRoute.get("/apprentice-levels/:careerName", async (c) => {
    return await aiController_1.aiController.getApprenticeLevels(c);
});
