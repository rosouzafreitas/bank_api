import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcrypt';
const saltRounds = 10;

import { pool } from '../database';

class UserRepository {
    checkUser = async (social_id:string) => {
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE social_id = $1', [social_id])
        if(response.rows[0]) {
            return true;
        } else return false;
    }

    createUser = async (name:string, birth_date:string, email:string, social_id:string, password:string) => {
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const response: QueryResult = await pool.query('INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)', [uuidv4(), name, birth_date, email, social_id, hashPassword])
        if(!response.rows[0]) {
            return true;
        } else return false;
    }

}

export { UserRepository }