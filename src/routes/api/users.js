import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
const users = new Hono();
users.get("/profile", async (c) => {
    const auth = getAuth(c);
    const user = await clerkClient.users.getUser(auth.userId);
    console.log("@@@@");
    console.log(user);
    if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    return c.text("hello");
});
export default users;
