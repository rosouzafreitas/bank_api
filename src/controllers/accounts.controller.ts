import { Request, Response } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../database';

import { UsersValidators } from '../validators/users.validators';
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


    loginAccountBySocialId = async (req: Request, res: Response): Promise<Response> => {
        const { social_id, password } = req.body;
    
        if(!social_id || !password) {
            return res.status(400).json({message: 'Please include the fields social_id, password'})
        }

        try {
            const UserValidator = new UsersValidators();
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");

            if(!await AccountService.checkAccountLogin(numeric_social_id, password)) {
                return res.status(401).json({message: "Password is wrong for this user"});
            }

            const response: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
            return res.status(200).json(response.rows);
        } catch(e) {
            console.log(e);
            return res.status(500).json('Account not found')
        }
    }


    createAccount = async (req: Request, res: Response): Promise<Response> => {
        const { name, birth_date, social_id, email, account_password, confirm_password } = req.body;
    
        if(!name || !birth_date || !social_id || !email || !account_password || !confirm_password) {
            return res.status(400).json({message: 'Please include the fields name, birth_date, social_id, email, account_password, confirm_password'})
        }
    
        try {
            const UserValidator = new UsersValidators();
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");
    
            if(!await UserService.checkUserExists(numeric_social_id)) {
                if(!UserValidator.checkDate(birth_date)) {
                    return res.status(400).json({message: 'Please insert a valid birth date in the format YYYY-MM-DD'})
                }
    
                if(!UserValidator.checkEmail(email)) {
                    return res.status(400).json({message: 'Please insert a valid e-mail address'})
                }
    
                if(!UserValidator.checkSocialId(social_id)) {
                    return res.status(400).json({message: 'Please insert a valid 11-digit social id'})
                }
    
                if(!await UserService.createUser(name, birth_date, email, numeric_social_id)) {
                    return res.status(500).json({message: 'Could not create user'})
                }
            }
    
            if(account_password.length > 12 || account_password.length < 8) {
                return res.status(400).json({message: 'Please use an 8 to 12-digit password'})
            }
    
            if(account_password !== confirm_password) {
                return res.status(400).json({message: 'Account passwords dont match'})
            }
    
            if(!await AccountService.createUserAccount(numeric_social_id, account_password)) {
                return res.status(500).json({message: `Could not create account`});
            }
            return res.status(201).json({message: "Account created successfully"});
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not create account')
        }
    }


    /*viewStatementBySocialId = async (req: Request, res: Response): Promise<Response> => {
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
    }*/
}

export { AccountsController };