import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { pool } from '../database';

class TransactionRepository {
    depositIntoAccount = async (social_id:string, value:string, tax:number) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
        if(account.rows[0]) {
            const response: QueryResult = await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                account.rows[0]['balance'] + parseFloat(value) - tax,
                account.rows[0]['id']
            ]);
            return true;
        } else return false;
    }

    depositIntoAccountByUUID = async (id:string, value:string, tax:number) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id])
        if(account.rows[0]) {
            const response: QueryResult = await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                account.rows[0]['balance'] + parseFloat(value) - tax,
                account.rows[0]['id']
            ]);
            return true;
        } else return false;
    }

    withdrawFromAccount = async (social_id:string, value:string) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
        if(account.rows[0]) {
            const response: QueryResult = await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [
                account.rows[0]['balance'] - parseFloat(value),
                account.rows[0]['id']
            ]);
            return true;
        } else return false;
    }

    storeDeposit = async (social_id:string, value:string, date:Date, tax:number) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
        if(account.rows[0]) {
            const response: QueryResult = await pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                uuidv4(),
                account.rows[0]['id'],
                null,
                'deposit',
                parseFloat(value),
                date,
                tax
            ]);
            return true;
        } else return false;
    }

    storeWithdraw = async (social_id:string, value:string, date:Date, tax:number) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
        if(account.rows[0]) {
            const response: QueryResult = await pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                uuidv4(),
                account.rows[0]['id'],
                null,
                'withdraw',
                parseFloat(value),
                date,
                tax
            ]);
            return true;
        } else return false;
    }

    storeTransfer = async (social_id:string, destination_id:string, value:string, date:Date, tax:number) => {
        const account: QueryResult = await pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id])
        if(account.rows[0]) {
            const destination: QueryResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [destination_id])
            if(destination.rows[0]) {
                const response: QueryResult = await pool.query('INSERT INTO transactions (id, origin_account, destination_account, transaction_type, value, date, tax) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                    uuidv4(),
                    account.rows[0]['id'],
                    destination.rows[0]['id'],
                    'transfer',
                    parseFloat(value),
                    date,
                    tax
                ]);
                return true;
            }
        } else return false;
    }
}

export { TransactionRepository }