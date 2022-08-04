"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const accounts_controller_1 = require("../controllers/accounts.controller");
//import { TransactionsController } from '../controllers/transactions.controller'
const router = (0, express_1.Router)();
const userController = new users_controller_1.UsersController();
const accountController = new accounts_controller_1.AccountsController();
//const transactionController = new TransactionsController();
router.get('/users', userController.getUsers);
router.get('/accounts', accountController.getAccounts);
router.post('/accounts', accountController.createAccount);
router.post('/login', accountController.loginAccountBySocialId);
//router.post('/statement', accountController.viewStatementBySocialId)
//router.put('/deposit', transactionController.depositIntoAccount)
//router.put('/withdraw', transactionController.withdrawFromAccount)
//router.put('/transfer', transactionController.transferFromAccount)
exports.default = router;
