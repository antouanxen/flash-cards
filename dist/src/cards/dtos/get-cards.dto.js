"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCardsDto = void 0;
const class_validator_1 = require("class-validator");
class GetCardsDto {
}
exports.GetCardsDto = GetCardsDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "front_text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1500),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "back_text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(7),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], GetCardsDto.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], GetCardsDto.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], GetCardsDto.prototype, "deleted_at", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "collectionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetCardsDto.prototype, "image_name", void 0);
//# sourceMappingURL=get-cards.dto.js.map