"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = void 0;
const errorCodes_1 = require("./errorCodes");
exports.errorMessages = {
    [errorCodes_1.ErrorCodes.INVALID_CREDENTIAL]: 'Invalid credential provided',
    [errorCodes_1.ErrorCodes.INVALID_EMAIL]: 'Invalid email',
    [errorCodes_1.ErrorCodes.USER_ID_NEEDED]: 'User ID is required',
    [errorCodes_1.ErrorCodes.USER_NOT_FOUND]: 'This user was not found',
    [errorCodes_1.ErrorCodes.USER_UPDATE_ERROR]: 'User cannot update',
    [errorCodes_1.ErrorCodes.USER_DELETE_ERROR]: 'User cannot delete',
    [errorCodes_1.ErrorCodes.ANY_USER_NOT_FOUND]: 'There is not any more to those users',
    [errorCodes_1.ErrorCodes.EMAIL_ALREADY_IN_USE]: 'Email is already in use',
    [errorCodes_1.ErrorCodes.USER_ALREADY_EXISTS]: 'This user already exists',
    [errorCodes_1.ErrorCodes.CREATE_ERROR]: 'Error to create user',
    [errorCodes_1.ErrorCodes.UPDATE_ERROR]: 'Error to update this user',
    [errorCodes_1.ErrorCodes.DELETE_ERROR]: 'Error to delete that user',
    [errorCodes_1.ErrorCodes.LOGIN_ERROR]: 'Error to login.. try again later',
    [errorCodes_1.ErrorCodes.LOGOUT_ERROR]: 'Error to logout.. try again later',
    [errorCodes_1.ErrorCodes.SERVER_ERROR]: 'An unexpected error occured to the server',
    [errorCodes_1.ErrorCodes.CARD_CREATE_ERROR]: 'Could not create that card',
    [errorCodes_1.ErrorCodes.CARD_UPDATE_ERROR]: 'Could not update that card',
    [errorCodes_1.ErrorCodes.CARD_NOT_FOUND]: 'That card was not found',
    [errorCodes_1.ErrorCodes.CARD_DELETE_ERROR]: 'Could not delete that card',
    [errorCodes_1.ErrorCodes.COLLECTION_CREATE_ERROR]: 'Could not create that collection',
    [errorCodes_1.ErrorCodes.COLLECTION_UPDATE_ERROR]: 'Could not update that collection',
    [errorCodes_1.ErrorCodes.COLLECTION_NOT_FOUND]: 'That collection was not found',
    [errorCodes_1.ErrorCodes.COLLECTION_DELETE_ERROR]: 'Could not delete that collection',
    [errorCodes_1.ErrorCodes.AUTH_FAILURE]: 'User is not authorized to proceed'
};
//# sourceMappingURL=errorMessages.js.map