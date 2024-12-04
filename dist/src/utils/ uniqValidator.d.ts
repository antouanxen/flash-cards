import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare class IsUniqueConstraint implements ValidatorConstraintInterface {
    validate(value: any): Promise<boolean>;
    defaultMessage(args?: ValidationArguments): string;
}
export declare function IsUnique(entity: string, field: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
