"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnToNull = turnToNull;
function turnToNull(deleted_at) {
    if (typeof deleted_at === null || deleted_at === 'null') {
        return null;
    }
    else if (typeof deleted_at === 'string') {
        const DeletedAtDate = new Date(deleted_at);
        return isNaN(DeletedAtDate.getTime()) ? null : DeletedAtDate;
    }
    return deleted_at;
}
//# sourceMappingURL=turnDeleteAtToNull.function.js.map