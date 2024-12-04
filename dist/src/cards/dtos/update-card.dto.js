"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const get_cards_dto_1 = require("./get-cards.dto");
class UpdateCardDto extends (0, mapped_types_1.PartialType)(get_cards_dto_1.GetCardsDto) {
}
exports.UpdateCardDto = UpdateCardDto;
//# sourceMappingURL=update-card.dto.js.map