"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoute = void 0;
const hono_1 = require("hono");
const aiController_1 = require("../../controllers/aiController");
exports.aiRoute = new hono_1.Hono();
exports.aiRoute.post("/chats", async (c) => {
    return await aiController_1.aiController.getChatResponse(c);
});
exports.aiRoute.post("/matchCareer", async (c) => {
    return await aiController_1.aiController.matchCareer(c);
});
exports.aiRoute.post("/createMyPathway", async (c) => {
    return await aiController_1.aiController.createMyPathway(c);
});
exports.aiRoute.post("/createMyPathwayFromCareer", async (c) => {
    return await aiController_1.aiController.createMyPathwayFromCareer(c);
});
