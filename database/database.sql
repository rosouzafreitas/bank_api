CREATE DATABASE bank_api;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    birth_date DATE,
    email VARCHAR(255),
    social_id VARCHAR(11)
);

INSERT INTO users 
VALUES (
    gen_random_uuid(),
    'Rodrigo',
    '2003-07-27',
    'rodrigo@email.com',
    '12345678910'
);

CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    agency_number VARCHAR(4),
    agency_digit INT,
    account_number VARCHAR(5),
    account_digit INT,
    balance REAL,
    user_id UUID,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO accounts 
VALUES (
    gen_random_uuid(),
    '0001',
    '1',
    '12345',
    '6',
    0,
    'caa5a7b3-a7c6-4eab-ac57-0d3c00a5f268'
);