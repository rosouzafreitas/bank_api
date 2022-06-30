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
exports.deleteAccount = exports.createAccount = exports.getAccountById = exports.getAccounts = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../database");
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * FROM accounts');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
});
exports.getAccounts = getAccounts;
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Account not found');
    }
});
exports.getAccountById = getAccountById;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agency_number, agency_digit, account_number, account_digit, user_id } = req.body;
        const response = yield database_1.pool.query('INSERT INTO accounts (id, agency_number, agency_digit, account_number, account_digit, balance, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [(0, uuid_1.v4)(), agency_number, agency_digit, account_number, account_digit, 0, user_id]);
        return res.status(200).json({
            body: {
                user: {
                    agency_number,
                    agency_digit,
                    account_number,
                    account_digit,
                    user_id
                }
            },
            message: "Account created succesfully"
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Could not create account');
    }
});
exports.createAccount = createAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('DELETE FROM accounts WHERE id = $1', [id]);
        return res.status(200).json(`Account ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Account not found');
    }
});
exports.deleteAccount = deleteAccount;
