import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { aiRoute } from "./src/routes/api/ai";
import { dbRoute } from "./src/routes/api/db";
import { quizRoute } from "./src/routes/api/quiz";
import { simulationRoute } from "./src/routes/api/simulation";
import testRoute from "./src/routes/api/test";
import userRoute from "./src/routes/api/users";
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

app.route("/api/test", testRoute);
app.route("/api/user", userRoute);
app.route("/api/ai", aiRoute);
app.route("/api/db", dbRoute);
app.route("/api/quiz", quizRoute);
app.route("/api/simulation", simulationRoute);
export default app;
