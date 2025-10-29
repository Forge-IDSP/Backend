import { dbService, DbService } from "./dbServices";
export class UserService {
    private _dbService: DbService;

    constructor(dbService:DbService) {
        this._dbService = dbService;
    }

    public async awardUserBadge(userId: string, badgeName: string) {
        return await this._dbService.awardBadge(userId, badgeName);
    }
   


}

export const userService = new UserService(dbService);
