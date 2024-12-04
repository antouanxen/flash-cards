"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../users/users.module");
const cards_controller_1 = require("./cards.controller");
const cards_service_1 = require("./providers/cards.service");
const collections_module_1 = require("../collections/collections.module");
const Card_Back_Text_Truncated_1 = require("../utils/Card_Back_Text_Truncated");
const synCardsForService_1 = require("./providers/synCardsForService");
const image_module_1 = require("../image/image.module");
let CardsModule = class CardsModule {
};
exports.CardsModule = CardsModule;
exports.CardsModule = CardsModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, collections_module_1.CollectionsModule, image_module_1.ImageModule],
        controllers: [cards_controller_1.CardsController],
        providers: [cards_service_1.CardsService, Card_Back_Text_Truncated_1.Back_Text_Truncated, synCardsForService_1.SynCardsForService],
        exports: [cards_service_1.CardsService]
    })
], CardsModule);
//# sourceMappingURL=cards.module.js.map