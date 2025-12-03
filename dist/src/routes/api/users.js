"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const clerk_auth_1 = require("@hono/clerk-auth");
const hono_1 = require("hono");
const users = new hono_1.Hono();
users.get("/profile", async (c) => {
    const auth = (0, clerk_auth_1.getAuth)(c);
    const user = await clerk_sdk_node_1.clerkClient.users.getUser(auth.userId);
    console.log("@@@@");
    console.log(user);
    if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    return c.text("hello");
});
exports.default = users;
