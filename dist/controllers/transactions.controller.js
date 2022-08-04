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
exports.TransactionsController = void 0;
const users_services_1 = require("../services/users.services");
const accounts_services_1 = require("../services/accounts.services");
const transactions_validators_1 = require("../validators/transactions.validators");
const transactions_services_1 = require("../services/transactions.services");
class TransactionsController {
    constructor() {
        this.depositIntoAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, user_password, account_type, value } = req.body;
            if (!social_id || !user_password || !account_type || !value) {
                return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, value' });
            }
            try {
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                const TransactionValidator = new transactions_validators_1.TransactionsValidators();
                const TransactionService = new transactions_services_1.TransactionsServices();
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
                if (!(yield AccountService.checkAccountExists(numeric_social_id))) {
                    return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
                }
                if (!(yield TransactionValidator.checkPositiveFloat(value))) {
                    return res.status(400).json({ message: 'Please insert a positive numeric value to deposit, use point (.) instead of comma' });
                }
                const tax = parseFloat(value) * 0.01;
                const date = new Date();
                if (!(yield TransactionService.depositValue(numeric_social_id, value, tax))) {
                    return res.status(500).json({ message: `Could not deposit value` });
                }
                if (!(yield TransactionService.registerDepositTransaction(numeric_social_id, value, date, tax))) {
                    return res.status(500).json({ message: `Could not store transaction` });
                }
                return res.status(200).json({
                    message: `Deposited succesfully ${value - tax} BRL, a deposit tax of ${tax.toFixed(4)} BRL was charged`
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not perform transaction');
            }
        });
        this.withdrawFromAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, user_password, account_type, account_password, value } = req.body;
            if (!social_id || !user_password || !account_type || !account_password || !value) {
                return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, value' });
            }
            try {
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                const TransactionValidator = new transactions_validators_1.TransactionsValidators();
                const TransactionService = new transactions_services_1.TransactionsServices();
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
                if (!(yield AccountService.checkAccountExists(numeric_social_id))) {
                    return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
                }
                if (!(yield AccountService.checkAccountLogin(numeric_social_id, account_password))) {
                    return res.status(401).json({ message: "Password is wrong for this account" });
                }
                if (!(yield TransactionValidator.checkPositiveFloat(value))) {
                    return res.status(400).json({ message: 'Please insert a positive numeric value to withdraw, use point (.) instead of comma' });
                }
                if (parseFloat(value) < 5) {
                    return res.status(400).json({ message: 'The minimum ammount to withdraw is 5 BRL' });
                }
                const balance = yield AccountService.getAccountFunds(numeric_social_id, account_password);
                if (parseFloat(value) > balance) {
                    return res.status(401).json({ message: 'Insufficient funds' });
                }
                const tax = 4;
                const date = new Date();
                if (!(yield TransactionService.withdrawValue(numeric_social_id, value))) {
                    return res.status(500).json({ message: `Could not withdraw value` });
                }
                if (!(yield TransactionService.registerWithdrawTransaction(numeric_social_id, value, date, tax))) {
                    return res.status(500).json({ message: `Could not store transaction` });
                }
                return res.status(200).json({
                    message: `Withdrawed succesfully ${value - tax} BRL, a fixed withdraw tax of ${tax} BRL was charged`
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not perform transaction');
            }
        });
        this.transferFromAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, user_password, account_type, account_password, destination_account_id, value } = req.body;
            if (!social_id || !user_password || !account_type || !account_password || !destination_account_id || !value) {
                return res.status(400).json({ message: 'Please include the fields social_id, user_password, account_type, account_password, destination_account_id, value' });
            }
            try {
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                const TransactionValidator = new transactions_validators_1.TransactionsValidators();
                const TransactionService = new transactions_services_1.TransactionsServices();
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
                if (!(yield AccountService.checkAccountExists(numeric_social_id))) {
                    return res.status(401).json({ message: `User doesn't have an ${account_type} account` });
                }
                if (!(yield AccountService.checkAccountLogin(numeric_social_id, account_password))) {
                    return res.status(401).json({ message: "Password is wrong for this account" });
                }
                if (!(yield TransactionValidator.checkValidUUID(destination_account_id))) {
                    return res.status(400).json({ message: `The destination account id inserted isn't valid` });
                }
                if (!(yield AccountService.checkAccountExistsByUUID(destination_account_id))) {
                    return res.status(401).json({ message: `Account ${destination_account_id} doesn't exist` });
                }
                if (yield AccountService.checkAccountsSameUUID(numeric_social_id, account_type, destination_account_id)) {
                    return res.status(401).json({ message: `You can't transfer to the same account` });
                }
                if (!(yield TransactionValidator.checkPositiveFloat(value))) {
                    return res.status(400).json({ message: 'Please insert a positive numeric value to transfer, use point (.) instead of comma' });
                }
                const balance = yield AccountService.getAccountFunds(numeric_social_id, account_password);
                if (parseFloat(value) > balance) {
                    return res.status(401).json({ message: 'Insufficient funds' });
                }
                const tax = 1;
                const date = new Date();
                if (!(yield TransactionService.withdrawValue(numeric_social_id, value))) {
                    return res.status(500).json({ message: `Could not withdraw value` });
                }
                if (!(yield TransactionService.depositValueByUUID(destination_account_id, value, tax))) {
                    return res.status(500).json({ message: `Could not transfer value` });
                }
                if (!(yield TransactionService.registerTransferTransaction(numeric_social_id, destination_account_id, value, date, tax))) {
                    return res.status(500).json({ message: `Could not store transaction` });
                }
                return res.status(200).json({
                    message: `Transfered succesfully ${value - tax} BRL, a fixed transfer tax of ${tax} BRL was charged`
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not perform transaction');
            }
        });
    }
}
exports.TransactionsController = TransactionsController;
