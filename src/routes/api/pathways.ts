import { Hono } from "hono";
import {
  upsertPathway,
  getPathwayById,
  listPathways,
  deletePathwayById,
  type Pathway,
} from "../../controllers/pathwayService";

const app = new Hono();

app.get("/", async (c) => {
  const items = await listPathways();
  return c.json(items);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const p = await getPathwayById(id);

  if (!p) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(p);
});

app.post("/", async (c) => {
  const body = (await c.req.json()) as Partial<Pathway>;

  if (!body.id || !body.templateSlug || !body.steps || !body.updatedAt) {
    return c.json(
      { error: "id, templateSlug, steps, updatedAt are required" },
      400
    );
  }

  const saved = await upsertPathway(body as Pathway);
  return c.json(saved);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await deletePathwayById(id);
  return c.json({ ok: true });
});

export default app;
