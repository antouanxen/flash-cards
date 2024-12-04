"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCollectionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const get_collections_dto_1 = require("./get-collections.dto");
const swagger_1 = require("@nestjs/swagger");
const find_collectionById_dto_1 = require("./find-collectionById.dto");
class UpdateCollectionDto extends (0, swagger_1.IntersectionType)((0, mapped_types_1.PartialType)(get_collections_dto_1.GetCollectionsDto), find_collectionById_dto_1.FindCollectionByIdDTO) {
}
exports.UpdateCollectionDto = UpdateCollectionDto;
//# sourceMappingURL=update-collection.dto.js.map