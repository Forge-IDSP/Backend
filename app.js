import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { aiRoute } from "./src/routes/api/ai.js";
import { dbRoute } from "./src/routes/api/db.js";
import { simulationRoute } from "./src/routes/api/simulation.js";
import userRoute from "./src/routes/api/users.js";
import pathwaysRoute from "./src/routes/api/pathways.js";
import myPathwaysRoute from "./src/routes/api/my-pathways.js";
const app = new Hono();
app.use("*", cors({
    // origin is default route for react+vite, we can decide to use built in CORS solution on vite or we can manually
    // do it here once our website goes live.
    origin: ["http://localhost:8081"],
    credentials: true,
}));
app.use("*", logger());
app.use("*", clerkMiddleware());
app.get("/", (c) => c.text("Hono!"));
app.route("/api/user", userRoute);
app.route("/api/ai", aiRoute);
app.route("/api/db", dbRoute);
app.route("/api/simulation", simulationRoute);
app.route("/api/pathways", pathwaysRoute);
app.route("/api/my-pathways", myPathwaysRoute);
export default app;
