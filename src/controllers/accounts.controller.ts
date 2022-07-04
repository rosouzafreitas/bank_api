import { Request, Response } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../database';

import { UsersServices } from '../services/users.services';
import { AccountsServices } from '../services/accounts.services';

class AccountsController {
    getAccounts = async (req: Request, res: Response): Promise<Response> => {
        try {
            const response: QueryResult = await pool.query('SELECT * FROM accounts')
            return res.status(200).json(response.rows);
        } catch(e) {
            console.log(e);
            return res.status(500).json('Internal Server Error')
        }
    }


    getAccountsBySocialId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const social_id = req.params.id;
            const response: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
            return res.status(200).json(response.rows);
        } catch(e) {
            console.log(e);
            return res.status(500).json('Account not found')
        }
    }


    createAccount = async (req: Request, res: Response): Promise<Response> => {
        const { social_id, user_password, account_type, account_password, confirm_password } = req.body;
    
        if(!social_id || !user_password || !account_type || !account_password || !confirm_password) {
            return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password, confirm_password'})
        }
    
        try {
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");
    
            if(!await UserService.checkUserExists(numeric_social_id)) {
                return res.status(404).json({message: 'User not found, please create an user account'});
            }
                
            if(!await UserService.checkUserLogin(numeric_social_id, user_password)) {
                return res.status(401).json({message: "Password is wrong for this user"});
            }
    
            if(account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({message: `Please use 'current' or 'savings' as account_type`})
            }
    
            if(account_password.length > 12 || account_password.length < 8) {
                return res.status(400).json({message: 'Please use an 8 to 12-digit password'})
            }
    
            if(account_password !== confirm_password) {
                return res.status(400).json({message: 'Account passwords dont match'})
            }

            if(await AccountService.checkAccountExists(numeric_social_id, account_type)) {
                return res.status(401).json({message: `User already has an ${account_type} account`});
            }
    
            if(!await AccountService.createUserAccount(numeric_social_id, account_type, account_password)) {
                return res.status(500).json({message: `Could not create account`});
            }
            return res.status(201).json({message: "Account created successfully"});
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not create account')
        }
    }


    deleteAccount = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const response: QueryResult = await pool.query('DELETE FROM accounts WHERE id = $1', [id])
            return res.status(200).json(`Account ${id} deleted successfully`);
        } catch(e) {
            console.log(e);
            return res.status(500).json('Account not found')
        }
    }


    viewStatementBySocialId = async (req: Request, res: Response): Promise<Response> => {
        const { social_id, user_password, account_type, account_password } = req.body;
    
        if(!social_id || !user_password || !account_type || !account_password) {
            return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password'})
        }
    
        try {
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");
    
            if(!await UserService.checkUserExists(numeric_social_id)) {
                return res.status(404).json({message: 'User not found, please create an user account'});
            }
                
            if(!await UserService.checkUserLogin(numeric_social_id, user_password)) {
                return res.status(401).json({message: "Password is wrong for this user"});
            }
    
            if(account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({message: `Please use 'current' or 'savings' as acccount_type`})
            }

            if(!await AccountService.checkAccountExists(numeric_social_id, account_type)) {
                return res.status(401).json({message: `User doesn't have an ${account_type} account`});
            }
        
            if(!await AccountService.checkAccountLogin(numeric_social_id, account_type, account_password)) {
                return res.status(401).json({message: "Password is wrong for this account"});
            }
    
            const statement = await AccountService.getAccountStatement(numeric_social_id, account_type, account_password)
            if(!statement) {
                return res.status(500).json('Could not fetch bank statement')
            }
    
            const balance = await AccountService.getAccountFunds(numeric_social_id, account_type, account_password)
    
            return res.status(200).json({balance: balance, statement: statement.rows, message: 'Statement fetched with no errors'});
    
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not fetch bank statement')
        }
    }
}

export { AccountsController };