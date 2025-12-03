"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRoute = void 0;
const hono_1 = require("hono");
const dbController_1 = require("../../controllers/dbController");
exports.dbRoute = new hono_1.Hono();
exports.dbRoute.get("/badges", (c) => dbController_1.dbController.getBadgesByTrade(c));
exports.dbRoute.get("/in-demands", (c) => dbController_1.dbController.getInDemands(c));
exports.dbRoute.get("/in-demands/:title", (c) => dbController_1.dbController.getJobDetailByTitle(c));
