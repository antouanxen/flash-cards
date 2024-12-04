import { Controller, Delete, Get, HttpException, HttpStatus, Param, Req } from "@nestjs/common";
import { UserService } from "./providers/users.service";
import { TheUsersDto } from "./dtos/users-dto";
import { ErrorCodes } from "src/utils/errorCodes";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('users')
@ApiTags('Users')
export class UserController {
    
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Fetch all the users' })
    public async getTheUsers(theUsersDto: TheUsersDto) {
        return await this.userService.getTheUsers(theUsersDto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Fetch the current user with all his cards and collections' })
    @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid', example: '57a75652-7a54-434f-94c3-6c01dddd3870', description: 'Unique identifier for the resource' }, required: true })
    @ApiResponse({ status: 200, description: 'User fetched successfully' })
    @ApiResponse({ status: 401, description: 'User is Unauthorized to proceed' })
    @ApiResponse({ status: 404, description: 'User was not found' })
    @ApiResponse({ status: 500, description: 'An error occured to the server' })
    public async getSingleUser(@Param('id') id: string, @Req() req: Request) {
        const userid = (req as any).res.locals.user

        if(!userid) {
            console.error('User ID is invalid');
            throw new HttpException({ message: 'User ID is required', errorCode: ErrorCodes.INVALID_CREDENTIAL }, HttpStatus.UNAUTHORIZED)
        }
        
        const user = await this.userService.findSingleUser(id, userid)
        console.log('οριστε ο user');

        return user
    }
    
    @Delete('/delete-user')
    @ApiOperation({ summary: 'Use this endpoint to delete a single user from the database using the token provided by Firebase'})
    @ApiResponse({ status: 200, description: 'The user was deleted successfully' })
    @ApiResponse({ status: 401, description: 'User is unauthorized to proceed' })
    @ApiResponse({ status: 404, description: 'That user was not found' })
    @ApiResponse({ status: 500, description: 'An error occured to the server' })
    async deleteUser (@Req() req: Request) {
        const userid = (req as any).res.locals.user

        if (!userid) {
            console.error('User ID is invalid')
            throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
        }

        const result = await this.userService.deleteUser(userid)
        if (typeof result === 'string') {
            console.error('Error to delete that user')
            throw new HttpException({ message: 'Error to delete that user', errorCode: ErrorCodes.DELETE_ERROR }, HttpStatus.BAD_REQUEST)
        }

        console.log(`O χρηστης με Firebase ID: ${userid}, διαγραφτηκε τελειως`);
        
        return{ message: 'User deleted successully'}
    }
}