import { dbService, DbService } from "./dbServices";
export class UserService {
    constructor(dbService) {
        this._dbService = dbService;
    }
    async awardUserBadge(userId, badgeName) {
        return await this._dbService.awardBadge(userId, badgeName);
    }
}
export const userService = new UserService(dbService);
