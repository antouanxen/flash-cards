"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCollectionDto = void 0;
const get_collections_dto_1 = require("./get-collections.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateCollectionDto extends (0, mapped_types_1.PartialType)(get_collections_dto_1.GetCollectionsDto) {
}
exports.CreateCollectionDto = CreateCollectionDto;
//# sourceMappingURL=create-collection.dto.js.map