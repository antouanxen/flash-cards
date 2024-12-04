"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCollectionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const get_collections_dto_1 = require("./get-collections.dto");
const find_collectionById_dto_1 = require("./find-collectionById.dto");
const swagger_1 = require("@nestjs/swagger");
class DeleteCollectionDto extends (0, swagger_1.IntersectionType)((0, mapped_types_1.PartialType)(get_collections_dto_1.GetCollectionsDto), find_collectionById_dto_1.FindCollectionByIdDTO) {
}
exports.DeleteCollectionDto = DeleteCollectionDto;
//# sourceMappingURL=delete-collection.dto.js.map