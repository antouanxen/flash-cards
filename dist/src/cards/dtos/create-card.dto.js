"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCardDto = void 0;
const get_cards_dto_1 = require("./get-cards.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateCardDto extends (0, mapped_types_1.PartialType)(get_cards_dto_1.GetCardsDto) {
}
exports.CreateCardDto = CreateCardDto;
//# sourceMappingURL=create-card.dto.js.map