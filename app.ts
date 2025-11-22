import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { aiRoute } from "./src/routes/api/ai";
import { dbRoute } from "./src/routes/api/db";
import { simulationRoute } from "./src/routes/api/simulation";
import userRoute from "./src/routes/api/users";
import pathwaysRoute from "./src/routes/api/pathways"
import { aiController } from "./src/controllers/aiController";
import {
  listPathways,
  getPathwayById,
  deletePathwayById,
} from "./src/controllers/pathwayService";



const app = new Hono();

app.use(
  "*",
  cors({
    // origin is default route for react+vite, we can decide to use built in CORS solution on vite or we can manually
    // do it here once our website goes live.
    origin: ["http://localhost:8081"],
    credentials: true,
  })
);
app.use("*", logger());
app.use("*", clerkMiddleware());
app.get("/", (c) => c.text("Hono!"));

app.route("/api/user", userRoute);
app.route("/api/ai", aiRoute);
app.route("/api/db", dbRoute);
app.route("/api/simulation", simulationRoute);
app.route("/api/pathways", pathwaysRoute);

app.post("/ai/createMyPathway", async (c) => {
  return await aiController.createMyPathway(c);
});

// List "my pathways" via /my-pathways?userId=...
app.get("/my-pathways", async (c) => {
  const userId = c.req.query("userId");

  const all = await listPathways();

  // If userId is passed, filter; otherwise return all
  const mine = userId
    ? all.filter((p: any) => p.userId === userId)
    : all;

  // Frontend often expects { data: [...] }
  return c.json({ data: mine });
});

// Detail: /api/my-pathways/:id (PathwaySummaryScreen)
app.get("/api/my-pathways/:id", async (c) => {
  const id = c.req.param("id");
  const p = await getPathwayById(id);

  if (!p) {
    return c.json({ error: "Not found" }, 404);
  }

  // Frontend does res.data?.data
  return c.json({ data: p });
});

// Delete: /api/my-pathways/:id
app.delete("/api/my-pathways/:id", async (c) => {
  const id = c.req.param("id");
  await deletePathwayById(id);
  return c.json({ ok: true });
});

export default app;
