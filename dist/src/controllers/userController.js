"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const userService_1 = require("./userService");
class UserController {
    constructor(service) {
        this._userService = service;
    }
}
exports.UserController = UserController;
exports.userController = new UserController(userService_1.userService);
