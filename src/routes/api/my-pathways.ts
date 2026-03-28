import { Hono } from "hono";
import { db } from "../../db/client";
import { myPathways } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const myPathwaysRoute = new Hono();

// GET /api/my-pathways?userId=xxx
myPathwaysRoute.get("/", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId required" }, 400);

  const rows = await db.query.myPathways.findMany({
    where: (mp, { eq }) => eq(mp.userId, userId),
    orderBy: (mp, { desc }) => [desc(mp.updatedAt)],
  });

  return c.json({ data: rows });
});

// GET /api/my-pathways/:id?userId=xxx
myPathwaysRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId required" }, 400);

  const row = await db.query.myPathways.findFirst({
    where: (mp, { eq, and }) => and(eq(mp.id, id), eq(mp.userId, userId)),
  });

  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// DELETE /api/my-pathways/:id
myPathwaysRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const { userId } = await c.req.json();
  if (!userId) return c.json({ error: "userId required" }, 400);

  await db
    .delete(myPathways)
    .where(and(eq(myPathways.id, id), eq(myPathways.userId, userId)));

  return c.json({ success: true });
});
