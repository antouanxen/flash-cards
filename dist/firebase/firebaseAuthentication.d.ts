import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
export declare class AuthenticateUser implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
