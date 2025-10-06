import { Hono } from "hono";
import { db, schema } from "../db/client";

const testRoute = new Hono();

testRoute.get("/", async (c) => {
  const rows = await db.select().from(schema.test).limit(10);
  return c.json(rows);
});

testRoute.post("/", async (c) => {
  const [inserted] = await db
    .insert(schema.test)
    .values({ email: `user${Date.now()}@example.com` })
    .returning();
  return c.json({ inserted });
});

export default testRoute;
