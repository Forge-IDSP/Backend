import { userService, UserService } from "./userService";

export class UserController {
    private _userService:UserService;

    constructor(service:UserService){
        this._userService = service;
    }

}
export const userController = new UserController(userService);