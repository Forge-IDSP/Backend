"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const pathwayService_1 = require("../../controllers/pathwayService");
const app = new hono_1.Hono();
app.get("/", async (c) => {
    const items = await (0, pathwayService_1.listPathways)();
    return c.json(items);
});
app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const p = await (0, pathwayService_1.getPathwayById)(id);
    if (!p) {
        return c.json({ error: "Not found" }, 404);
    }
    return c.json(p);
});
app.post("/", async (c) => {
    const body = (await c.req.json());
    if (!body.id || !body.templateSlug || !body.steps || !body.updatedAt) {
        return c.json({ error: "id, templateSlug, steps, updatedAt are required" }, 400);
    }
    const saved = await (0, pathwayService_1.upsertPathway)(body);
    return c.json(saved);
});
app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    await (0, pathwayService_1.deletePathwayById)(id);
    return c.json({ ok: true });
});
exports.default = app;
