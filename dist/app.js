"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clerk_auth_1 = require("@hono/clerk-auth");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const ai_js_1 = require("./src/routes/api/ai.js");
const db_js_1 = require("./src/routes/api/db.js");
const simulation_js_1 = require("./src/routes/api/simulation.js");
const users_js_1 = __importDefault(require("./src/routes/api/users.js"));
const pathways_js_1 = __importDefault(require("./src/routes/api/pathways.js"));
const my_pathways_js_1 = __importDefault(require("./src/routes/api/my-pathways.js"));
const app = new hono_1.Hono();
app.use("*", (0, cors_1.cors)({
    // origin is default route for react+vite, we can decide to use built in CORS solution on vite or we can manually
    // do it here once our website goes live.
    origin: ["http://localhost:8081"],
    credentials: true,
}));
app.use("*", (0, logger_1.logger)());
app.use("/api/user/*", (0, clerk_auth_1.clerkMiddleware)());
app.get("/", (c) => c.text("Hono!"));
app.route("/api/user", users_js_1.default);
app.route("/api/ai", ai_js_1.aiRoute);
app.route("/api/db", db_js_1.dbRoute);
app.route("/api/simulation", simulation_js_1.simulationRoute);
app.route("/api/pathways", pathways_js_1.default);
app.route("/api/my-pathways", my_pathways_js_1.default);
exports.default = app;
