import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcrypt';
const saltRounds = 10;

import { pool } from '../database';

import { UserServices } from '../services/users.service';

const userServices = new UserServices();

class UsersController {
    getUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const response: QueryResult = await pool.query('SELECT * FROM users')
            return res.status(200).json(response.rows);
        } catch(e) {
            console.log(e);
            return res.status(500).json('Internal Server Error')
        }
    }

    getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id])
            return res.status(200).json(response.rows);
        } catch(e) {
            console.log(e);
            return res.status(500).json('User not found')
        }
    }
    
    createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, birth_date, email, social_id, password } = req.body;

            if(!userServices.checkDate(birth_date)) {
                return res.status(400).json({message: 'Please insert a valid birth date in the format DD/MM/YYYY'})
            }

            if(!userServices.checkEmail(email)) {
                return res.status(400).json({message: 'Please insert a valid e-mail address'})
            }

            const social_id_regex = /(\d{3})[.]?(\d{3})[.]?(\d{3})[-]?(\d{2})/gm;

            if(!social_id_regex.test(social_id)) {
                return res.status(400).json({message: 'Please insert a valid social id'})
            }

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");

            if(numeric_social_id.length > 11) {
                return res.status(400).json({message: 'Please insert an 11 digit social id'})
            }

            const user: QueryResult = await pool.query('SELECT * FROM users WHERE social_id = $1', [numeric_social_id])
    
            if(user.rows[0]) {
                return res.status(401).json({message: 'Social ID already in use'});
            }
    
            const password_regex = /^\d+$/;
            
            if(password.length < 6 || password.length > 6 || !password_regex.test(password)) {
                return res.status(400).json({message: 'Please insert a 6-digit numeric password'})
            }
    
            const hashPassword = await bcrypt.hash(password, saltRounds);
    
            const response: QueryResult = await pool.query('INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)', [uuidv4(), name, birth_date, email, numeric_social_id, hashPassword])
            return res.status(200).json({
                body: {
                    user: {
                        name,
                        birth_date,
                        email,
                        social_id,
                        password
                    }
                },
                message: "User created succesfully"
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({message: 'Could not create user'})
        }
    }

    updateUser = async (req: Request, res: Response): Promise<Response> => {
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

    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const response: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id])
            return res.status(200).json(`User ${id} deleted successfully`);
        } catch(e) {
            console.log(e);
            return res.status(500).json('User not found')
        }
    }
}

export { UsersController };