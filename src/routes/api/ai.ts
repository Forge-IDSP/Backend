import { Hono } from "hono";
import { aiController } from "../../controllers/aiController";

export const aiRoute = new Hono();

aiRoute.post("/chats", async (c: any) => {
  return await aiController.getChatResponse(c);
});

aiRoute.post("/matchCareer", async (c: any) => {
  return await aiController.matchCareer(c);
});
