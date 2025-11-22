import { Hono } from "hono";
import { aiController } from "../../controllers/aiController";
import { createMyPathway } from "../../controllers/myPathwayService"; // adjust path if needed


export const aiRoute = new Hono();

aiRoute.post("/chats", async (c: any) => {
  return await aiController.getChatResponse(c);
});

aiRoute.post("/matchCareer", async (c: any) => {
  return await aiController.matchCareer(c);
});

aiRoute.post("/createMyPathway", async (c: any) => {
  return await aiController.createMyPathway(c);
});
