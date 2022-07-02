CREATE DATABASE bank_api;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    birth_date DATE,
    email VARCHAR(255),
    social_id VARCHAR(11),
    password VARCHAR(255)
);

CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    agency_number VARCHAR(4),
    agency_digit INT,
    account_number VARCHAR(6),
    account_digit INT,
    account_type VARCHAR(7),
    balance REAL,
    user_id UUID,
    social_id VARCHAR(11),
    password VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(social_id) REFERENCES users(social_id)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    origin_account UUID,
    destination_account UUID,
    transaction_type VARCHAR(8),
    value REAL,
    FOREIGN KEY(origin_account) REFERENCES accounts(id),
    FOREIGN KEY(destination_account) REFERENCES accounts(id)
);