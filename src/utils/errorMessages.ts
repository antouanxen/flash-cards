import { ErrorCodes } from "./errorCodes";

export const errorMessages: Record<ErrorCodes, string> = {
    [ErrorCodes.INVALID_CREDENTIAL]: 'Invalid credential provided',
    [ErrorCodes.INVALID_EMAIL]: 'Invalid email',
    [ErrorCodes.USER_ID_NEEDED]: 'User ID is required',
    [ErrorCodes.USER_NOT_FOUND]: 'This user was not found',
    [ErrorCodes.USER_UPDATE_ERROR]: 'User cannot update',
    [ErrorCodes.USER_DELETE_ERROR]: 'User cannot delete',
    [ErrorCodes.ANY_USER_NOT_FOUND]: 'There is not any more to those users',
    [ErrorCodes.EMAIL_ALREADY_IN_USE]: 'Email is already in use',
    [ErrorCodes.USER_ALREADY_EXISTS]: 'This user already exists',
    [ErrorCodes.CREATE_ERROR]: 'Error to create user',
    [ErrorCodes.UPDATE_ERROR]: 'Error to update this user',
    [ErrorCodes.DELETE_ERROR]: 'Error to delete that user',
    [ErrorCodes.LOGIN_ERROR]: 'Error to login.. try again later',
    [ErrorCodes.LOGOUT_ERROR]: 'Error to logout.. try again later',
    [ErrorCodes.SERVER_ERROR]: 'An unexpected error occured to the server',
    [ErrorCodes.CARD_CREATE_ERROR]: 'Could not create that card',
    [ErrorCodes.CARD_UPDATE_ERROR]: 'Could not update that card',
    [ErrorCodes.CARD_NOT_FOUND]: 'That card was not found',
    [ErrorCodes.CARD_DELETE_ERROR]: 'Could not delete that card',
    [ErrorCodes.COLLECTION_CREATE_ERROR]: 'Could not create that collection',
    [ErrorCodes.COLLECTION_UPDATE_ERROR]: 'Could not update that collection',
    [ErrorCodes.COLLECTION_NOT_FOUND]: 'That collection was not found',
    [ErrorCodes.COLLECTION_DELETE_ERROR]: 'Could not delete that collection',
    [ErrorCodes.AUTH_FAILURE]: 'User is not authorized to proceed'
}