import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import testRoute from "./src/routes/api/test";
import { clerkMiddleware } from "@hono/clerk-auth";
import 'dotenv/config'
import userRoute from "./src/routes/api/users";

const app = new Hono();

app.use('*', cors({
// origin is default route for react+vite, we can decide to use built in CORS solution on vite or we can manually
// do it here once our website goes live.
  origin: ['http://localhost:5173'],
  credentials: true,
}))
app.use("*", logger());
app.use('*', clerkMiddleware())

app.get("/", (c) => c.text("Hono!"));

app.route("/api/test", testRoute);
app.route("/api/user", userRoute);

export default app;
