import { Hono } from "hono";
import { db } from "../../db/client";
import { myPathways } from "../../db/schema";
import { eq } from "drizzle-orm";
const app = new Hono();
// GET /api/my-pathways?userId=xxxx → list all for user
app.get("/", async (c) => {
    const userId = c.req.query("userId");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }
    const rows = await db
        .select()
        .from(myPathways)
        .where(eq(myPathways.userId, userId));
    return c.json({ data: rows });
});
// GET /api/my-pathways/:id → get one
app.get("/:id", async (c) => {
    const userId = c.req.query("userId");
    const id = c.req.param("id");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }
    const rows = await db
        .select()
        .from(myPathways)
        .where(eq(myPathways.id, Number(id)));
    const row = rows[0];
    if (!row || row.userId !== userId) {
        return c.json({ error: "Not found" }, 404);
    }
    return c.json({ data: row });
});
// DELETE /api/my-pathways/:id
app.delete("/:id", async (c) => {
    const userId = c.req.query("userId");
    const id = c.req.param("id");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }
    await db
        .delete(myPathways)
        .where(eq(myPathways.id, Number(id)));
    return c.json({ success: true });
});
export default app;
