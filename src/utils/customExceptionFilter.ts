import { ArgumentsHost,  Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "./errorCodes";
import { errorMessages } from "./errorMessages";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse()
        const request = context.getRequest()
        const status = exception.getStatus()
        const exceptionResponse = exception.getResponse()

        const errorCode = this.extractErrorCode(exceptionResponse)
        const message = errorMessages[errorCode] || errorMessages[ErrorCodes.SERVER_ERROR]

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            errorCode: errorCode
        })
    }

    private extractErrorCode(exceptionResponse: any): ErrorCodes {
        return exceptionResponse?.['errorCode'] || ErrorCodes.SERVER_ERROR
    }
}
