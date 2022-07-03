"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserRepository {
    constructor() {
        this.users = [];
    }
    findByUsername(username) {
        // SELECT * FROM USERS WHERE USERNAME = '' LIMIT
        const userExists = this.users.find((user) => user.username === username);
        return userExists;
    }
    save(user) {
        // INSERT INTO USERS(USERNAME, NAME) VALUES('', '');
        const id = Math.random().toString();
        const userWithId = Object.assign(Object.assign({}, user), { id });
        this.users.push(userWithId);
        return userWithId;
    }
}
exports.default = new UserRepository();
