import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ResLocals = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        return response.locals[data as string]
    }
)