"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const dbServices_1 = require("./dbServices");
class UserService {
    constructor(dbService) {
        this._dbService = dbService;
    }
    async awardUserBadge(userId, badgeName) {
        return await this._dbService.awardBadge(userId, badgeName);
    }
}
exports.UserService = UserService;
exports.userService = new UserService(dbServices_1.dbService);
