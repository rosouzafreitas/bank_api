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
exports.TransactionRepository = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../database");
class TransactionRepository {
    constructor() {
        this.depositIntoAccount = (social_id, account_type, value, tax) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const response = yield database_1.pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                    account.rows[0]['balance'] + parseFloat(value) - tax,
                    account.rows[0]['id']
                ]);
                return true;
            }
            else
                return false;
        });
        this.depositIntoAccountByUUID = (id, value, tax) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
            if (account.rows[0]) {
                const response = yield database_1.pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                    account.rows[0]['balance'] + parseFloat(value) - tax,
                    account.rows[0]['id']
                ]);
                return true;
            }
            else
                return false;
        });
        this.withdrawFromAccount = (social_id, account_type, value) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const response = yield database_1.pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                    account.rows[0]['balance'] - parseFloat(value),
                    account.rows[0]['id']
                ]);
                return true;
            }
            else
                return false;
        });
        this.storeDeposit = (social_id, account_type, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const response = yield database_1.pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                    (0, uuid_1.v4)(),
                    account.rows[0]['id'],
                    null,
                    'deposit',
                    parseFloat(value),
                    date,
                    tax
                ]);
                return true;
            }
            else
                return false;
        });
        this.storeWithdraw = (social_id, account_type, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const response = yield database_1.pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                    (0, uuid_1.v4)(),
                    account.rows[0]['id'],
                    null,
                    'withdraw',
                    parseFloat(value),
                    date,
                    tax
                ]);
                return true;
            }
            else
                return false;
        });
        this.storeTransfer = (social_id, account_type, destination_id, value, date, tax) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const destination = yield database_1.pool.query('SELECT * FROM accounts WHERE id = $1', [destination_id]);
                if (destination.rows[0]) {
                    const response = yield database_1.pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                        (0, uuid_1.v4)(),
                        account.rows[0]['id'],
                        destination.rows[0]['id'],
                        'transfer',
                        parseFloat(value),
                        date,
                        tax
                    ]);
                    return true;
                }
            }
            else
                return false;
        });
    }
}
exports.TransactionRepository = TransactionRepository;
