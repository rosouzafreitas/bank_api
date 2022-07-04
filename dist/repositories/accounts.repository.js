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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const database_1 = require("../database");
class AccountRepository {
    constructor() {
        this.checkAccount = (social_id, account_type) => __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (response.rows[0]) {
                return true;
            }
            else
                return false;
        });
        this.checkAccountByUUID = (id) => __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
            if (response.rows[0]) {
                return true;
            }
            else
                return false;
        });
        this.checkIfSameAccount = (social_id, account_type, id) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                if (account.rows[0]['id'] == id) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        });
        this.createAccount = (social_id, account_type, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [social_id]);
            if (user.rows[0]) {
                const agency_number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                const agency_digit = Math.floor(Math.random() * (9 - 0 + 1));
                const account_number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                const account_digit = Math.floor(Math.random() * (9 - 0 + 1));
                const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const response = yield database_1.pool.query('INSERT INTO accounts (id, agency_number, agency_digit, account_number, account_digit, account_type, balance, user_id, social_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [
                    (0, uuid_1.v4)(),
                    agency_number,
                    agency_digit,
                    account_number,
                    account_digit,
                    account_type,
                    0,
                    user.rows[0]['id'],
                    user.rows[0]['social_id'],
                    hashPassword
                ]);
                return true;
            }
            else
                return false;
        });
        this.loginAccount = (social_id, account_type, password) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const account_login = yield bcrypt_1.default.compareSync(password, account.rows[0]['password']);
                if (account_login) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        });
        this.getFunds = (social_id, account_type, password) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const account_login = yield bcrypt_1.default.compareSync(password, account.rows[0]['password']);
                if (account_login) {
                    return account.rows[0]['balance'];
                }
                else
                    return false;
            }
            else
                return false;
        });
        this.getStatement = (social_id, account_type, password) => __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (account.rows[0]) {
                const account_login = yield bcrypt_1.default.compareSync(password, account.rows[0]['password']);
                if (account_login) {
                    const statement = yield database_1.pool.query('SELECT transactions.id, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.origin_account)) AS sender, transactions.origin_account, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.destination_account)) AS receiver, transactions.destination_account, transactions.transaction_type, transactions.value, transactions.date, transactions.tax FROM transactions WHERE origin_account = $1 OR destination_account = $1 ORDER BY transactions.date DESC', [account.rows[0]['id']]);
                    return statement;
                }
                else
                    return false;
            }
            else
                return false;
        });
    }
}
exports.AccountRepository = AccountRepository;
