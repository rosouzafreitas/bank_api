"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsValidators = void 0;
class TransactionsValidators {
    constructor() {
        this.checkPositiveFloat = (value) => __awaiter(this, void 0, void 0, function* () {
            const regex = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
            if (regex.test(value)) {
                return true;
            }
            else
                return false;
        });
        this.checkValidUUID = (uuid) => __awaiter(this, void 0, void 0, function* () {
            const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (regex.test(uuid)) {
                return true;
            }
            else
                return false;
        });
    }
}
exports.TransactionsValidators = TransactionsValidators;
