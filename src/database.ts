import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'foo',
    database: 'bank_api',
    port: 5432
});