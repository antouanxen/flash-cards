"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResLocals = void 0;
const common_1 = require("@nestjs/common");
exports.ResLocals = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return response.locals[data];
});
//# sourceMappingURL=res_locals_decorator.js.map