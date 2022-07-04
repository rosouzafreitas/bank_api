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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const database_1 = require("../database");
const users_validators_1 = require("../validators/users.validators");
const users_services_1 = require("../services/users.services");
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
                const validator = new users_validators_1.UsersValidators();
                const service = new users_services_1.UsersServices();
                if (!validator.checkDate(birth_date)) {
                    return res.status(400).json({ message: 'Please insert a valid birth date in the format YYYY-MM-DD' });
                }
                if (!validator.checkEmail(email)) {
                    return res.status(400).json({ message: 'Please insert a valid e-mail address' });
                }
                if (!validator.checkSocialId(social_id)) {
                    return res.status(400).json({ message: 'Please insert a valid 11-digit social id' });
                }
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (yield service.checkUserExists(numeric_social_id)) {
                    return res.status(401).json({ message: 'Social ID already in use' });
                }
                if (!validator.checkUserPassword(password)) {
                    return res.status(400).json({ message: 'Please insert a 6-digit numeric password' });
                }
                if (!(yield service.createUser(name, birth_date, email, numeric_social_id, password))) {
                    return res.status(500).json({ message: 'Could not create user' });
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
