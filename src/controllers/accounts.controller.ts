import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcrypt';
const saltRounds = 10;

import { pool } from '../database';

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
            const user: QueryResult = await pool.query('SELECT * FROM users WHERE social_id = $1', [social_id])
    
            if(!user.rows[0]) {
                return res.status(404).json({message: 'User not found, please create an user account'});
            }
            
            const login = await bcrypt.compareSync(user_password, user.rows[0]['password']);
    
            if(!login) {
                return res.status(401).json({
                    message: "Password is wrong for this user"
                });
            }
    
            if(account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({message: `Please use 'current' or 'savings' as acccount_type`})
            }
    
            if(account_password !== confirm_password) {
                return res.status(400).json({message: 'Account passwords dont match'})
            }
    
            const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
    
            if(account.rows[0]) {
                return res.status(401).json({message: `User already has an ${account_type} account`});
            }
    
            const agency_number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const agency_digit = Math.floor(Math.random() * (9 - 0 + 1));
            const account_number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const account_digit = Math.floor(Math.random() * (9 - 0 + 1));
            const hashPassword = await bcrypt.hash(account_password, saltRounds);
    
            const response: QueryResult = await pool.query('INSERT INTO accounts (id, agency_number, agency_digit, account_number, account_digit, account_type, balance, user_id, social_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [
                uuidv4(),
                agency_number,
                agency_digit, 
                account_number,
                account_digit,
                account_type,
                0,
                user.rows[0]['id'],
                user.rows[0]['social_id'],
                hashPassword
            ]);
            return res.status(200).json({
                body: {
                    user: {
                        agency_number,
                        agency_digit,
                        account_number,
                        account_digit,
                        account_type
                    }
                },
                message: "Account created succesfully"
            });
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
            const user: QueryResult = await pool.query('SELECT * FROM users WHERE social_id = $1', [social_id])
    
            if(!user.rows[0]) {
                return res.status(404).json({message: 'User not found, please create an user account'});
            }
            
            const login = await bcrypt.compareSync(user_password, user.rows[0]['password']);
    
            if(!login) {
                return res.status(401).json({
                    message: "Password is wrong for this user"
                });
            }
    
            if(account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({message: `Please use 'current' or 'savings' as acccount_type`})
            }
    
            const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
    
            if(!account.rows[0]) {
                return res.status(401).json({message: `User doesn't have an ${account_type} account`});
            }
    
            const account_login = await bcrypt.compareSync(account_password, account.rows[0]['password']);
    
            if(!account_login) {
                return res.status(401).json({
                    message: "Password is wrong for this account"
                });
            }
    
            const statement: QueryResult = await pool.query(
                'SELECT transactions.id, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.origin_account)) AS sender, transactions.origin_account, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.destination_account)) AS receiver, transactions.destination_account, transactions.transaction_type, transactions.value, transactions.date, transactions.tax FROM transactions WHERE origin_account = $1 OR destination_account = $1 ORDER BY transactions.date DESC',
                [account.rows[0]['id']]
            )
    
            const balance = account.rows[0]['balance'];
            const account_id = account.rows[0]['id'];
    
            const full_statement = statement.rows;
    
            return res.status(200).json({my_account: account_id, balance: balance, statement: full_statement, message: 'Statement fetched with no errors'});
    
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not fetch bank statement')
        }
    }
}

export { AccountsController };