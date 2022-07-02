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
exports.withdrawFromAccount = exports.depositIntoAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const database_1 = require("../database");
const depositIntoAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { social_id, user_password, account_type, value } = req.body;
        if (!social_id || !user_password || !account_type || !value) {
            return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, value' });
        }
        try {
            const db = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [social_id]);
            if (!db.rows[0]) {
                return res.status(404).json({ message: 'User not found, please create an user account' });
            }
            const login = yield bcrypt_1.default.compareSync(user_password, db.rows[0]['password']);
            if (!login) {
                return res.status(401).json({
                    message: "Password is wrong for this user"
                });
            }
            if (account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({ message: `Please use 'current' or 'savings' as acccount_type` });
            }
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (!account.rows[0]) {
                return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
            }
            const regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
            if (!regex.test(value)) {
                return res.status(400).json({ message: 'Please insert a numeric value to deposit, use point (.) instead of comma' });
            }
            const response = yield database_1.pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                account.rows[0]['balance'] + parseFloat(value),
                account.rows[0]['id']
            ]);
            return res.status(200).json({
                message: `Deposited succesfully ${value}`
            });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json('Could not perform transaction');
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json('Bad request');
    }
});
exports.depositIntoAccount = depositIntoAccount;
const withdrawFromAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { social_id, user_password, account_type, account_password, value } = req.body;
        if (!social_id || !user_password || !account_type || !account_password || !value) {
            return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, value' });
        }
        try {
            const db = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [social_id]);
            if (!db.rows[0]) {
                return res.status(404).json({ message: 'User not found, please create an user account' });
            }
            const user_login = yield bcrypt_1.default.compareSync(user_password, db.rows[0]['password']);
            if (!user_login) {
                return res.status(401).json({
                    message: "Password is wrong for this user"
                });
            }
            if (account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({ message: `Please use 'current' or 'savings' as acccount_type` });
            }
            const account = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type]);
            if (!account.rows[0]) {
                return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
            }
            const account_login = yield bcrypt_1.default.compareSync(account_password, account.rows[0]['password']);
            if (!account_login) {
                return res.status(401).json({
                    message: "Password is wrong for this account"
                });
            }
            const regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
            if (!regex.test(value)) {
                return res.status(400).json({ message: 'Please insert a numeric value to withdraw, use point (.) instead of comma' });
            }
            if (parseFloat(value) > account.rows[0]['balance']) {
                return res.status(401).json({ message: 'Insufficient funds' });
            }
            const response = yield database_1.pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                account.rows[0]['balance'] - parseFloat(value),
                account.rows[0]['id']
            ]);
            return res.status(200).json({
                message: `Withdrawed succesfully ${value}`
            });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json('Could not perform transaction');
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json('Bad request');
    }
});
exports.withdrawFromAccount = withdrawFromAccount;
