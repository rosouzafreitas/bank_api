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
exports.AccountsController = void 0;
const database_1 = require("../database");
const users_services_1 = require("../services/users.services");
const accounts_services_1 = require("../services/accounts.services");
class AccountsController {
    constructor() {
        this.getAccounts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.pool.query('SELECT * FROM accounts');
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Internal Server Error');
            }
        });
        this.getAccountsBySocialId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const social_id = req.params.id;
                const response = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id]);
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Account not found');
            }
        });
        this.createAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, user_password, account_type, account_password, confirm_password } = req.body;
            if (!social_id || !user_password || !account_type || !account_password || !confirm_password) {
                return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, confirm_password' });
            }
            try {
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (!(yield UserService.checkUserExists(numeric_social_id))) {
                    return res.status(404).json({ message: 'User not found, please create an user account' });
                }
                if (!(yield UserService.checkUserLogin(numeric_social_id, user_password))) {
                    return res.status(401).json({ message: "Password is wrong for this user" });
                }
                if (account_type !== 'current' && account_type !== 'savings') {
                    return res.status(400).json({ message: `Please use 'current' or 'savings' as account_type` });
                }
                if (account_password.length > 12 || account_password.length < 8) {
                    return res.status(400).json({ message: 'Please use an 8 to 12-digit password' });
                }
                if (account_password !== confirm_password) {
                    return res.status(400).json({ message: 'Account passwords dont match' });
                }
                if (yield AccountService.checkAccountExists(numeric_social_id, account_type)) {
                    return res.status(401).json({ message: `User already has an ${account_type} account` });
                }
                if (!(yield AccountService.createUserAccount(numeric_social_id, account_type, account_password))) {
                    return res.status(500).json({ message: `Could not create account` });
                }
                return res.status(201).json({ message: "Account created successfully" });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not create account');
            }
        });
        this.deleteAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this.viewStatementBySocialId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, user_password, account_type, account_password } = req.body;
            if (!social_id || !user_password || !account_type || !account_password) {
                return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password' });
            }
            try {
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (!(yield UserService.checkUserExists(numeric_social_id))) {
                    return res.status(404).json({ message: 'User not found, please create an user account' });
                }
                if (!(yield UserService.checkUserLogin(numeric_social_id, user_password))) {
                    return res.status(401).json({ message: "Password is wrong for this user" });
                }
                if (account_type !== 'current' && account_type !== 'savings') {
                    return res.status(400).json({ message: `Please use 'current' or 'savings' as acccount_type` });
                }
                if (!(yield AccountService.checkAccountExists(numeric_social_id, account_type))) {
                    return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
                }
                if (!(yield AccountService.checkAccountLogin(numeric_social_id, account_type, account_password))) {
                    return res.status(401).json({ message: "Password is wrong for this account" });
                }
                const statement = yield AccountService.getAccountStatement(numeric_social_id, account_type, account_password);
                if (!statement) {
                    return res.status(500).json('Could not fetch bank statement');
                }
                const balance = yield AccountService.getAccountFunds(numeric_social_id, account_type, account_password);
                return res.status(200).json({ balance: balance, statement: statement.rows, message: 'Statement fetched with no errors' });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not fetch bank statement');
            }
        });
    }
}
exports.AccountsController = AccountsController;
