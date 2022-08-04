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
exports.AccountsController = void 0;
const database_1 = require("../database");
const users_validators_1 = require("../validators/users.validators");
const users_services_1 = require("../services/users.services");
const accounts_services_1 = require("../services/accounts.services");
class AccountsController {
    constructor() {
        this.getAccounts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.pool.query('SELECT * FROM accounts');
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Internal Server Error');
            }
        });
        this.loginAccountBySocialId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { social_id, password } = req.body;
            if (!social_id || !password) {
                return res.status(400).json({ message: 'Please include the fields social_id, password' });
            }
            try {
                const UserValidator = new users_validators_1.UsersValidators();
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (!(yield AccountService.checkAccountLogin(numeric_social_id, password))) {
                    return res.status(401).json({ message: "Password is wrong for this user" });
                }
                const response = yield database_1.pool.query('SELECT * FROM accounts WHERE social_id = $1', [social_id]);
                return res.status(200).json(response.rows);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Account not found');
            }
        });
        this.createAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, birth_date, social_id, email, account_password, confirm_password } = req.body;
            if (!name || !birth_date || !social_id || !email || !account_password || !confirm_password) {
                return res.status(400).json({ message: 'Please include the fields name, birth_date, social_id, email, account_password, confirm_password' });
            }
            try {
                const UserValidator = new users_validators_1.UsersValidators();
                const UserService = new users_services_1.UsersServices();
                const AccountService = new accounts_services_1.AccountsServices();
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
                if (!(yield UserService.checkUserExists(numeric_social_id))) {
                    if (!UserValidator.checkDate(birth_date)) {
                        return res.status(400).json({ message: 'Please insert a valid birth date in the format YYYY-MM-DD' });
                    }
                    if (!UserValidator.checkEmail(email)) {
                        return res.status(400).json({ message: 'Please insert a valid e-mail address' });
                    }
                    if (!UserValidator.checkSocialId(social_id)) {
                        return res.status(400).json({ message: 'Please insert a valid 11-digit social id' });
                    }
                    if (!(yield UserService.createUser(name, birth_date, email, numeric_social_id))) {
                        return res.status(500).json({ message: 'Could not create user' });
                    }
                }
                if (account_password.length > 12 || account_password.length < 8) {
                    return res.status(400).json({ message: 'Please use an 8 to 12-digit password' });
                }
                if (account_password !== confirm_password) {
                    return res.status(400).json({ message: 'Account passwords dont match' });
                }
                if (!(yield AccountService.createUserAccount(numeric_social_id, account_password))) {
                    return res.status(500).json({ message: `Could not create account` });
                }
                return res.status(201).json({ message: "Account created successfully" });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json('Could not create account');
            }
        });
        /*viewStatementBySocialId = async (req: Request, res: Response): Promise<Response> => {
            const { social_id, user_password, account_type, account_password } = req.body;
        
            if(!social_id || !user_password || !account_type || !account_password) {
                return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password'})
            }
        
            try {
                const UserService = new UsersServices();
                const AccountService = new AccountsServices();
    
                let numeric_social_id = social_id.split('.').join("");
                numeric_social_id = numeric_social_id.split('-').join("");
        
                if(!await UserService.checkUserExists(numeric_social_id)) {
                    return res.status(404).json({message: 'User not found, please create an user account'});
                }
                    
                if(!await UserService.checkUserLogin(numeric_social_id, user_password)) {
                    return res.status(401).json({message: "Password is wrong for this user"});
                }
        
                if(account_type !== 'current' && account_type !== 'savings') {
                    return res.status(400).json({message: `Please use 'current' or 'savings' as acccount_type`})
                }
    
                if(!await AccountService.checkAccountExists(numeric_social_id, account_type)) {
                    return res.status(401).json({message: `User doesn't have an ${account_type} account`});
                }
            
                if(!await AccountService.checkAccountLogin(numeric_social_id, account_type, account_password)) {
                    return res.status(401).json({message: "Password is wrong for this account"});
                }
        
                const statement = await AccountService.getAccountStatement(numeric_social_id, account_type, account_password)
                if(!statement) {
                    return res.status(500).json('Could not fetch bank statement')
                }
        
                const balance = await AccountService.getAccountFunds(numeric_social_id, account_type, account_password)
        
                return res.status(200).json({balance: balance, statement: statement.rows, message: 'Statement fetched with no errors'});
        
            } catch (e) {
                console.log(e);
                return res.status(500).json('Could not fetch bank statement')
            }
        }*/
    }
}
exports.AccountsController = AccountsController;
