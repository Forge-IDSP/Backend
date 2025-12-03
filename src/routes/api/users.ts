import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const users = new Hono();

users.get("/profile", async (c) => {
  const auth = getAuth(c);

    if (!auth || !auth.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await clerkClient.users.getUser(auth!.userId!);

  console.log("@@@@ user profile");
  console.log(user);

    return c.json({ id: user.id, email: user.emailAddresses[0]?.emailAddress });
});

export default users;
