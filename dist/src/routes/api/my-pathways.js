"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const client_1 = require("../../db/client");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const app = new hono_1.Hono();
// GET /api/my-pathways?userId=xxxx → list all for user
app.get("/", async (c) => {
    const userId = c.req.query("userId");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }
    const rows = await client_1.db
        .select()
        .from(schema_1.myPathways)
        .where((0, drizzle_orm_1.eq)(schema_1.myPathways.userId, userId));
    return c.json({ data: rows });
});
// GET /api/my-pathways/:id → get one
app.get("/:id", async (c) => {
    const userId = c.req.query("userId");
    const id = c.req.param("id");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }
    const rows = await client_1.db
        .select()
        .from(schema_1.myPathways)
        .where((0, drizzle_orm_1.eq)(schema_1.myPathways.id, Number(id)));
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
    await client_1.db
        .delete(schema_1.myPathways)
        .where((0, drizzle_orm_1.eq)(schema_1.myPathways.id, Number(id)));
    return c.json({ success: true });
});
exports.default = app;
