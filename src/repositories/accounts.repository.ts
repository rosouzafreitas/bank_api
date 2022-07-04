import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcrypt';
const saltRounds = 10;

import { pool } from '../database';

class AccountRepository {
    checkAccount = async (social_id:string, account_type:string) => {
        const response: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
        if(response.rows[0]) {
            return true;
        } else return false;
    }

    checkAccountByUUID = async (id:string) => {
        const response: QueryResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id])
        if(response.rows[0]) {
            return true;
        } else return false;
    }

    checkIfSameAccount = async (social_id:string, account_type:string, id:string) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
        if(account.rows[0]) {
            if(account.rows[0]['id'] == id) {
                return true;
            } else return false;
        } else return false;
    }

    createAccount = async (social_id:string, account_type:string, password:string) => {
        const user: QueryResult = await pool.query('SELECT * FROM users WHERE social_id = $1', [social_id])
        if(user.rows[0]) {
            const agency_number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const agency_digit = Math.floor(Math.random() * (9 - 0 + 1));
            const account_number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const account_digit = Math.floor(Math.random() * (9 - 0 + 1));
            const hashPassword = await bcrypt.hash(password, saltRounds);
    
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
            
            return true;
        } else return false;
    }

    loginAccount = async (social_id:string, account_type:string, password:string) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
        if(account.rows[0]) {
            const account_login = await bcrypt.compareSync(password, account.rows[0]['password']);
            if(account_login) {
                return true;
            } else return false;
        } else return false;
    }

    getFunds = async (social_id:string, account_type:string, password:string) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
        if(account.rows[0]) {
            const account_login = await bcrypt.compareSync(password, account.rows[0]['password']);
            if(account_login) {
                return account.rows[0]['balance'];
            } else return false;
        } else return false;
    }

    getStatement = async (social_id:string, account_type:string, password:string) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1 AND account_type = $2', [social_id, account_type])
        if(account.rows[0]) {
            const account_login = await bcrypt.compareSync(password, account.rows[0]['password']);
            if(account_login) {
                const statement: QueryResult = await pool.query(
                    'SELECT transactions.id, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.origin_account)) AS sender, transactions.origin_account, (SELECT users.name FROM users WHERE users.id = (SELECT user_id FROM accounts WHERE id = transactions.destination_account)) AS receiver, transactions.destination_account, transactions.transaction_type, transactions.value, transactions.date, transactions.tax FROM transactions WHERE origin_account = $1 OR destination_account = $1 ORDER BY transactions.date DESC',
                    [account.rows[0]['id']]
                )
                return statement;
            } else return false;
        } else return false;
    }
}

export { AccountRepository }