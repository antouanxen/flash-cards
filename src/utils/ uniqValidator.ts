import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import prisma from "prisma/prisma_Client";

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public async validate(value: any): Promise<boolean> {
      const record = await prisma.user.findUnique({ where: { email: value } })
      return !record
  }

  defaultMessage(args?: ValidationArguments) {
      const [field, entity] = args.constraints
      return `${field} already exists in ${entity}.`
  }
}

export function IsUnique(entity: string, field: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}