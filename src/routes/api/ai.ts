import { Hono } from "hono";
import { aiController } from "../../controllers/aiController";

export const aiRoute = new Hono();

aiRoute.post("/chats", async (c) => {
  return await aiController.getChatResponse(c);
});

aiRoute.post("/createMyPathwayFromCareer", async (c) => {
  return await aiController.createMyPathwayFromCareer(c);
});

aiRoute.get("/match", async (c) => {
  return await aiController.matchCareer(c);
});
