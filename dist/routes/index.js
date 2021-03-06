"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const accounts_controller_1 = require("../controllers/accounts.controller");
const transactions_controller_1 = require("../controllers/transactions.controller");
const router = (0, express_1.Router)();
const userController = new users_controller_1.UsersController();
const accountController = new accounts_controller_1.AccountsController();
const transactionController = new transactions_controller_1.TransactionsController();
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users', userController.updateUser);
router.get('/accounts', accountController.getAccounts);
router.get('/accounts/:id', accountController.getAccountsBySocialId);
router.post('/accounts', accountController.createAccount);
router.post('/statement', accountController.viewStatementBySocialId);
router.delete('/accounts/:id', accountController.deleteAccount);
router.put('/deposit', transactionController.depositIntoAccount);
router.put('/withdraw', transactionController.withdrawFromAccount);
router.put('/transfer', transactionController.transferFromAccount);
exports.default = router;
