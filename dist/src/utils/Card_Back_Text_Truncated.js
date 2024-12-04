"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Back_Text_Truncated = void 0;
const common_1 = require("@nestjs/common");
let Back_Text_Truncated = class Back_Text_Truncated {
    truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }
    cardForLogging(card, maxLength = 50) {
        return {
            ...card,
            back_text: this.truncateText(card.back_text, maxLength)
        };
    }
    ;
};
exports.Back_Text_Truncated = Back_Text_Truncated;
exports.Back_Text_Truncated = Back_Text_Truncated = __decorate([
    (0, common_1.Injectable)()
], Back_Text_Truncated);
//# sourceMappingURL=Card_Back_Text_Truncated.js.map