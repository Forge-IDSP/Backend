import { Hono } from "hono";
import { aiController } from "../../controllers/aiController";
export const aiRoute = new Hono();
aiRoute.post("/chats", async (c) => {
    return await aiController.getChatResponse(c);
});
aiRoute.post("/matchCareer", async (c) => {
    return await aiController.matchCareer(c);
});
aiRoute.post("/createMyPathway", async (c) => {
    return await aiController.createMyPathway(c);
});
aiRoute.post("/createMyPathwayFromCareer", async (c) => {
    return await aiController.createMyPathwayFromCareer(c);
});
