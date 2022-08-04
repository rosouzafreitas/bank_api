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
exports.AccountsServices = void 0;
const accounts_repository_1 = require("../repositories/accounts.repository");
class AccountsServices {
    constructor() {
        this.checkAccountExists = (social_id) => __awaiter(this, void 0, void 0, function* () {
            const repository = new accounts_repository_1.AccountRepository();
            if (yield repository.checkAccount(social_id)) {
                return true;
            }
            else
                return false;
        });
        this.checkAccountExistsByUUID = (id) => __awaiter(this, void 0, void 0, function* () {
            const repository = new accounts_repository_1.AccountRepository();
            if (yield repository.checkAccountByUUID(id)) {
                return true;
            }
            else
                return false;
        });
        this.checkAccountsSameUUID = (social_id, account_type, id) => __awaiter(this, void 0, void 0, function* () {
            const repository = new accounts_repository_1.AccountRepository();
            if (yield repository.checkIfSameAccount(social_id, account_type, id)) {
                return true;
            }
            else
                return false;
        });
        this.createUserAccount = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            const repository = new accounts_repository_1.AccountRepository();
            if (yield repository.createAccount(social_id, password)) {
                return true;
            }
            else
                return false;
        });
        this.checkAccountLogin = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkAccountExists(social_id)) {
                const repository = new accounts_repository_1.AccountRepository();
                if (yield repository.loginAccount(social_id, password)) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        });
        this.getAccountFunds = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkAccountExists(social_id)) {
                const repository = new accounts_repository_1.AccountRepository();
                if (yield repository.getFunds(social_id, password)) {
                    return repository.getFunds(social_id, password);
                }
                else
                    return false;
            }
            else
                return false;
        });
        this.getAccountStatement = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkAccountExists(social_id)) {
                const repository = new accounts_repository_1.AccountRepository();
                if (yield repository.getStatement(social_id, password)) {
                    return repository.getStatement(social_id, password);
                }
                else
                    return false;
            }
            else
                return false;
        });
    }
}
exports.AccountsServices = AccountsServices;
