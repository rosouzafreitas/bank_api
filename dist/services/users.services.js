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
exports.UsersServices = void 0;
const users_repository_1 = require("../repositories/users.repository");
class UsersServices {
    constructor() {
        this.checkUserExists = (social_id) => __awaiter(this, void 0, void 0, function* () {
            const repository = new users_repository_1.UserRepository();
            if (yield repository.checkUser(social_id)) {
                return true;
            }
            else
                return false;
        });
        this.createUser = (name, birth_date, email, social_id) => __awaiter(this, void 0, void 0, function* () {
            const repository = new users_repository_1.UserRepository();
            if (yield repository.createUser(name, birth_date, email, social_id)) {
                return true;
            }
            else
                return false;
        });
        this.checkUserLogin = (social_id, password) => __awaiter(this, void 0, void 0, function* () {
            const repository = new users_repository_1.UserRepository();
            if (yield repository.loginUser(social_id, password)) {
                return true;
            }
            else
                return false;
        });
    }
}
exports.UsersServices = UsersServices;
