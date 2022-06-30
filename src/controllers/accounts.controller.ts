import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { pool } from '../database';


export const getAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM accounts')
        return res.status(200).json(response.rows);
    } catch(e) {
        console.log(e);
        return res.status(500).json('Internal Server Error')
    }
}


export const getAccountById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const response: QueryResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id])
        return res.status(200).json(response.rows);
    } catch(e) {
        console.log(e);
        return res.status(500).json('Account not found')
    }
}


export const createAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { agency_number, agency_digit, account_number, account_digit, user_id } = req.body;
        const response: QueryResult = await pool.query('INSERT INTO accounts (id, agency_number, agency_digit, account_number, account_digit, balance, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuidv4(), agency_number, agency_digit, account_number, account_digit, 0, user_id])
        return res.status(200).json({
            body: {
                user: {
                    agency_number,
                    agency_digit,
                    account_number,
                    account_digit,
                    user_id
                }
            },
            message: "Account created succesfully"
        });
    } catch(e) {
        console.log(e);
        return res.status(500).json('Could not create account')
    }
}


export const deleteAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const response: QueryResult = await pool.query('DELETE FROM accounts WHERE id = $1', [id])
        return res.status(200).json(`Account ${id} deleted successfully`);
    } catch(e) {
        console.log(e);
        return res.status(500).json('Account not found')
    }
}