"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUniqueConstraint = void 0;
exports.IsUnique = IsUnique;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_Client_1 = require("../../prisma/prisma_Client");
let IsUniqueConstraint = class IsUniqueConstraint {
    async validate(value) {
        const record = await prisma_Client_1.default.user.findUnique({ where: { email: value } });
        return !record;
    }
    defaultMessage(args) {
        const [field, entity] = args.constraints;
        return `${field} already exists in ${entity}.`;
    }
};
exports.IsUniqueConstraint = IsUniqueConstraint;
exports.IsUniqueConstraint = IsUniqueConstraint = __decorate([
    (0, common_1.Injectable)(),
    (0, class_validator_1.ValidatorConstraint)({ async: true })
], IsUniqueConstraint);
function IsUnique(entity, field, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, field],
            validator: IsUniqueConstraint,
        });
    };
}
//# sourceMappingURL=%20uniqValidator.js.map