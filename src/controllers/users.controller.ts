import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { pool } from '../database';


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM users')
        return res.status(200).json(response.rows);
    } catch(e) {
        console.log(e);
        return res.status(500).json('Internal Server Error')
    }
}


export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        return res.status(200).json(response.rows);
    } catch(e) {
        console.log(e);
        return res.status(500).json('User not found')
    }
}


export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, birth_date, email, social_id } = req.body;
        const response: QueryResult = await pool.query('INSERT INTO users (id, name, birth_date, email, social_id) VALUES ($1, $2, $3, $4, $5)', [uuidv4(), name, birth_date, email, social_id])
        return res.status(200).json({
            body: {
                user: {
                    name,
                    birth_date,
                    email,
                    social_id
                }
            },
            message: "User created succesfully"
        });
    } catch(e) {
        console.log(e);
        return res.status(500).json('Could not create user')
    }
}


export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, name, birth_date, email, social_id } = req.body;
        const response: QueryResult = await pool.query('UPDATE users SET name = $1, birth_date = $2, email = $3, social_id = $4 WHERE id = $5', [name, birth_date, email, social_id, id])
        return res.status(200).json({
            body: {
                user: {
                    name,
                    birth_date,
                    email,
                    social_id
                }
            },
            message: "User updated succesfully"
        });
    } catch(e) {
        console.log(e);
        return res.status(500).json('Could not update user')
    }
}


export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const response: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id])
        return res.status(200).json(`User ${id} deleted successfully`);
    } catch(e) {
        console.log(e);
        return res.status(500).json('User not found')
    }
}