import { Router } from 'express';
const router = Router();

import { getUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/users.controller'
import { getAccounts, getAccountsBySocialId, createAccount, deleteAccount } from '../controllers/accounts.controller'
import { depositIntoAccount, withdrawFromAccount } from '../controllers/transactions.controllers'

router.get('/users', getUsers);
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.delete('/users/:id', deleteUser)
router.put('/users', updateUser)

router.get('/accounts', getAccounts)
router.get('/accounts/:id', getAccountsBySocialId)
router.post('/accounts', createAccount)
router.delete('/accounts/:id', deleteAccount)

router.put('/deposit', depositIntoAccount)
router.put('/withdraw', withdrawFromAccount)


export default router;