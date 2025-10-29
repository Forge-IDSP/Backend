import { Hono } from "hono";
import { dbController} from "../../controllers/dbController"

export const dbRoute = new Hono();

dbRoute.get("/badges", (c) => dbController.getBadgesByTrade(c));
