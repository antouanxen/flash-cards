import { UserService } from "./providers/users.service";
import { TheUsersDto } from "./dtos/users-dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getTheUsers(theUsersDto: TheUsersDto): Promise<{
        id: string;
        username: string;
        email: string;
        created_at: Date;
        userid: string;
    }[]>;
    getSingleUser(id: string, req: Request): Promise<{
        id: string;
        username: string;
        email: string;
        created_at: Date;
        userid: string;
    }>;
    deleteUser(req: Request): Promise<{
        message: string;
    }>;
}
