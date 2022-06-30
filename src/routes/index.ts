import { Router } from 'express';
const router = Router();

import { getUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/users.controller'
import { getAccounts, getAccountById, createAccount, deleteAccount } from '../controllers/accounts.controller'

router.get('/users', getUsers);
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.delete('/users/:id', deleteUser)
router.put('/users', updateUser)

router.get('/accounts', getAccounts)
router.get('/accounts/:id', getAccountById)
router.post('/accounts', createAccount)
router.delete('/accounts/:id', deleteAccount)


export default router;