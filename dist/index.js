"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const port = 3000;
Bun.serve({
    port,
    fetch: app_1.default.fetch
});
console.log(`Server running at http://localhost:${port}`);
