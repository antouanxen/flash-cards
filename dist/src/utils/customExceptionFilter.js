"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const errorCodes_1 = require("./errorCodes");
const errorMessages_1 = require("./errorMessages");
let CustomExceptionFilter = class CustomExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const errorCode = this.extractErrorCode(exceptionResponse);
        const message = errorMessages_1.errorMessages[errorCode] || errorMessages_1.errorMessages[errorCodes_1.ErrorCodes.SERVER_ERROR];
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            errorCode: errorCode
        });
    }
    extractErrorCode(exceptionResponse) {
        return exceptionResponse?.['errorCode'] || errorCodes_1.ErrorCodes.SERVER_ERROR;
    }
};
exports.CustomExceptionFilter = CustomExceptionFilter;
exports.CustomExceptionFilter = CustomExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], CustomExceptionFilter);
//# sourceMappingURL=customExceptionFilter.js.map