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

    
    createUser = async (req: Request, res: Response, name: string, birth_date: string, social_id: string, email: string): Promise<Response> => {
    
        if(!name || !birth_date || !social_id || !email) {
            return res.status(400).json({message: 'Please include the fields name, birth_date, social_id, email'})
        }

        try {
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

            if(!await service.createUser(name, birth_date, email, numeric_social_id)) {
                return res.status(500).json({message: 'Could not create user'})
            }

            return res.status(201).json({
                body: {
                    user: {
                        name,
                        birth_date,
                        email,
                        social_id,
                    }
                },
                message: "User created succesfully"
            });
        } catch(e) {
            console.log(e);
            return res.status(500).json({message: 'Could not create user'})
        }
    }
}

export { UsersController };