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
        this.createUser = (req, res, name, birth_date, social_id, email) => __awaiter(this, void 0, void 0, function* () {
            if (!name || !birth_date || !social_id || !email) {
                return res.status(400).json({ message: 'Please include the fields name, birth_date, social_id, email' });
            }
            try {
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
                if (!(yield service.createUser(name, birth_date, email, numeric_social_id))) {
                    return res.status(500).json({ message: 'Could not create user' });
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
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: 'Could not create user' });
            }
        });
    }
}
exports.UsersController = UsersController;
