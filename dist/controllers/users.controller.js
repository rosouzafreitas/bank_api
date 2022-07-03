"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const database_1 = require("../database");
const users_service_1 = require("../services/users.service");
const userServices = new users_service_1.UserServices();
class UsersController {
    constructor() {
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.pool.query('SELECT * FROM users');
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Internal Server Error');
            }
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield database_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('User not found');
            }
        });
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, birth_date, email, social_id, password } = req.body;
                if (!userServices.checkDate(birth_date)) {
                    return res.status(400).json({ message: 'Please insert a valid birth date in the format DD/MM/YYYY' });
                }
                if (!userServices.checkEmail(email)) {
                    return res.status(400).json({ message: 'Please insert a valid e-mail address' });
                }
                const social_id_regex = /(\d{3})[.]?(\d{3})[.]?(\d{3})[-]?(\d{2})/gm;
                if (!social_id_regex.test(social_id)) {
                    return res.status(400).json({ message: 'Please insert a valid social id' });
                }
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (numeric_social_id.length > 11) {
                    return res.status(400).json({ message: 'Please insert an 11 digit social id' });
                }
                const user = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [numeric_social_id]);
                if (user.rows[0]) {
                    return res.status(401).json({ message: 'Social ID already in use' });
                }
                const password_regex = /^\d+$/;
                if (password.length < 6 || password.length > 6 || !password_regex.test(password)) {
                    return res.status(400).json({ message: 'Please insert a 6-digit numeric password' });
                }
                const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const response = yield database_1.pool.query('INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)', [(0, uuid_1.v4)(), name, birth_date, email, numeric_social_id, hashPassword]);
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
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: 'Could not create user' });
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, birth_date, email, social_id } = req.body;
                const response = yield database_1.pool.query('UPDATE users SET name = $1, birth_date = $2, email = $3, social_id = $4 WHERE id = $5', [name, birth_date, email, social_id, id]);
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
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not update user');
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield database_1.pool.query('DELETE FROM users WHERE id = $1', [id]);
                return res.status(200).json(`User ${id} deleted successfully`);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('User not found');
            }
        });
    }
}
exports.UsersController = UsersController;
