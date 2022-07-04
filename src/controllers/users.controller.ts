import { Request, Response } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../database';

import { UsersValidators } from '../validators/users.validators';
import { UsersServices } from '../services/users.services';

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

            const validator = new UsersValidators();
            const service = new UsersServices();

            if(!validator.checkDate(birth_date)) {
                return res.status(400).json({message: 'Please insert a valid birth date in the format YYYY-MM-DD'})
            }

            if(!validator.checkEmail(email)) {
                return res.status(400).json({message: 'Please insert a valid e-mail address'})
            }

            if(!validator.checkSocialId(social_id)) {
                return res.status(400).json({message: 'Please insert a valid 11-digit social id'})
            }

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");
    
            if(await service.checkUserExists(numeric_social_id)) {
                return res.status(401).json({message: 'Social ID already in use'});
            }
            
            if(!validator.checkUserPassword(password)) {
                return res.status(400).json({message: 'Please insert a 6-digit numeric password'})
            }

            if(!await service.createUser(name, birth_date, email, numeric_social_id, password)) {
                return res.status(500).json({message: 'Could not create user'})
            }

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