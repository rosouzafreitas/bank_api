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
exports.UserRepository = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const database_1 = require("../database");
class UserRepository {
    constructor() {
        this.checkUser = (social_id) => __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [social_id]);
            if (response.rows[0]) {
                return true;
            }
            else
                return false;
        });
        this.createUser = (name, birth_date, email, social_id, password) => __awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const response = yield database_1.pool.query('INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)', [(0, uuid_1.v4)(), name, birth_date, email, social_id, hashPassword]);
            if (!response.rows[0]) {
                return true;
            }
            else
                return false;
        });
        this.loginUser = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.pool.query('SELECT * FROM users WHERE social_id = $1', [social_id]);
            if (response.rows[0]) {
                const login = yield bcrypt_1.default.compareSync(password, response.rows[0]['password']);
                if (login) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        });
    }
}
exports.UserRepository = UserRepository;
