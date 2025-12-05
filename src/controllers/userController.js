import { userService, UserService } from "./userService";
export class UserController {
    constructor(service) {
        this._userService = service;
    }
}
export const userController = new UserController(userService);
