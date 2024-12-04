import { user } from '@prisma/client';
import { TheUsersDto } from '../dtos/users-dto';
export declare class UserService {
    getTheUsers(theUsersDto: TheUsersDto): Promise<user[]>;
    findSingleUser(id: string, userid: string): Promise<user | null>;
    deleteUser(userid: string): Promise<void | string>;
}
