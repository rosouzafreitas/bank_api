import { Router } from 'express';

import { UsersController } from '../controllers/users.controller'

import { AccountsController } from '../controllers/accounts.controller'

import { TransactionsController } from '../controllers/transactions.controller'

const router = Router();

const userController = new UsersController();

const accountController = new AccountsController();

const transactionController = new TransactionsController();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById)
router.post('/users', userController.createUser)
router.delete('/users/:id', userController.deleteUser)
router.put('/users', userController.updateUser)

router.get('/accounts', accountController.getAccounts)
router.get('/accounts/:id', accountController.getAccountsBySocialId)
router.post('/accounts', accountController.createAccount)
router.post('/statement', accountController.viewStatementBySocialId)
router.delete('/accounts/:id', accountController.deleteAccount)

router.put('/deposit', transactionController.depositIntoAccount)
router.put('/withdraw', transactionController.withdrawFromAccount)
router.put('/transfer', transactionController.transferFromAccount)


export default router;