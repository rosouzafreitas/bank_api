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
exports.TransactionsServices = void 0;
const transactions_repository_1 = require("../repositories/transactions.repository");
class TransactionsServices {
    constructor() {
        this.depositValue = (social_id, value, tax) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.depositIntoAccount(social_id, value, tax)) {
                return true;
            }
            else
                return false;
        });
        this.depositValueByUUID = (id, value, tax) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.depositIntoAccountByUUID(id, value, tax)) {
                return true;
            }
            else
                return false;
        });
        this.withdrawValue = (social_id, value) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.withdrawFromAccount(social_id, value)) {
                return true;
            }
            else
                return false;
        });
        this.registerDepositTransaction = (social_id, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.storeDeposit(social_id, value, date, tax)) {
                return true;
            }
            else
                return false;
        });
        this.registerWithdrawTransaction = (social_id, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.storeWithdraw(social_id, value, date, tax)) {
                return true;
            }
            else
                return false;
        });
        this.registerTransferTransaction = (social_id, destination_id, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const repository = new transactions_repository_1.TransactionRepository();
            if (yield repository.storeTransfer(social_id, destination_id, value, date, tax)) {
                return true;
            }
            else
                return false;
        });
    }
}
exports.TransactionsServices = TransactionsServices;
