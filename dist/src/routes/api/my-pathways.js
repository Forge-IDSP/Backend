"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myPathwaysRoute = void 0;
const hono_1 = require("hono");
const client_1 = require("../../db/client");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.myPathwaysRoute = new hono_1.Hono();
// GET /api/my-pathways?userId=xxx
exports.myPathwaysRoute.get("/", async (c) => {
    const userId = c.req.query("userId");
    if (!userId)
        return c.json({ error: "userId required" }, 400);
    const rows = await client_1.db.query.myPathways.findMany({
        where: (mp, { eq }) => eq(mp.userId, userId),
        orderBy: (mp, { desc }) => [desc(mp.updatedAt)],
    });
    return c.json({ data: rows });
});
// GET /api/my-pathways/:id?userId=xxx
exports.myPathwaysRoute.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const userId = c.req.query("userId");
    if (!userId)
        return c.json({ error: "userId required" }, 400);
    const row = await client_1.db.query.myPathways.findFirst({
        where: (mp, { eq, and }) => and(eq(mp.id, id), eq(mp.userId, userId)),
    });
    if (!row)
        return c.json({ error: "Not found" }, 404);
    return c.json(row);
});
// DELETE /api/my-pathways/:id
exports.myPathwaysRoute.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const { userId } = await c.req.json();
    if (!userId)
        return c.json({ error: "userId required" }, 400);
    await client_1.db
        .delete(schema_1.myPathways)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.myPathways.id, id), (0, drizzle_orm_1.eq)(schema_1.myPathways.userId, userId)));
    return c.json({ success: true });
});
