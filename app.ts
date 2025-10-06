import { Hono } from "hono";
import { logger } from "hono/logger";
import testRoute from "./src/routes/test";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => c.text("Hono!"));
app.route("/api/test", testRoute);

export default app;
