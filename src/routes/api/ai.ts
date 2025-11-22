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
  const body = await c.req.json();

  // basic validation – tighten if you want
  if (!body.userId || !body.title || !body.steps) {
    return c.json(
      { error: "userId, title, steps are required" },
      400
    );
  }

  const row = await createMyPathway({
    userId: body.userId,
    title: body.title,
    steps: body.steps,
    aiSummary: body.aiSummary,
    aiData: body.aiData,
    badgeNames: body.badgeNames ?? [],
  });

  return c.json(row);
})