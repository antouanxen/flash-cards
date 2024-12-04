import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
    private extractErrorCode;
}
