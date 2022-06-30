"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_controller_1 = require("../controllers/users.controller");
const accounts_controller_1 = require("../controllers/accounts.controller");
router.get('/users', users_controller_1.getUsers);
router.get('/users/:id', users_controller_1.getUserById);
router.post('/users', users_controller_1.createUser);
router.delete('/users/:id', users_controller_1.deleteUser);
router.put('/users', users_controller_1.updateUser);
router.get('/accounts', accounts_controller_1.getAccounts);
router.get('/accounts/:id', accounts_controller_1.getAccountById);
router.post('/accounts', accounts_controller_1.createAccount);
router.delete('/accounts/:id', accounts_controller_1.deleteAccount);
exports.default = router;
