import { Request, Response } from 'express';

import { UsersServices } from '../services/users.services';
import { AccountsServices } from '../services/accounts.services';
import { TransactionsValidators } from '../validators/transactions.validators';
import { TransactionsServices } from '../services/transactions.services';

class TransactionsController {
    depositIntoAccount = async (req: Request, res: Response): Promise<Response> => {
        const { social_id, user_password, account_type, value } = req.body;
    
        if(!social_id || !user_password || !account_type || !value) {
            return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password, value'})
        }
    
        try {
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();
            const TransactionValidator = new TransactionsValidators();
            const TransactionService = new TransactionsServices();

            let numeric_social_id = social_id.split('.').join("");
            numeric_social_id = numeric_social_id.split('-').join("");
    
            if(!await UserService.checkUserExists(numeric_social_id)) {
                return res.status(404).json({message: 'User not found, please create an user account'});
            }
                
            if(!await UserService.checkUserLogin(numeric_social_id, user_password)) {
                return res.status(401).json({message: "Password is wrong for this user"});
            }
    
            if(account_type !== 'current' && account_type !== 'savings') {
                return res.status(400).json({message: `Please use 'current' or 'savings' as account_type`})
            }

            if(!await AccountService.checkAccountExists(numeric_social_id, account_type)) {
                return res.status(401).json({message: `User doesn't have an ${account_type} account`});
            }
    
            if(!await TransactionValidator.checkPositiveFloat(value)) {
                return res.status(400).json({message: 'Please insert a positive numeric value to deposit, use point (.) instead of comma'})
            }
    
            const tax = parseFloat(value) * 0.01;
    
            const date = new Date();

            if(!await TransactionService.depositValue(numeric_social_id, account_type, value, tax)) {
                return res.status(500).json({message: `Could not deposit value`});
            }

            if(!await TransactionService.registerDepositTransaction(numeric_social_id, account_type, value, date, tax)) {
                return res.status(500).json({message: `Could not store transaction`});
            }

            return res.status(200).json({
                message: `Deposited succesfully ${value - tax} BRL, a deposit tax of ${tax.toFixed(4)} BRL was charged`
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not perform transaction')
        }
    }


    withdrawFromAccount = async (req: Request, res: Response): Promise<Response> => {
        const { social_id, user_password, account_type, account_password, value } = req.body;
    
        if(!social_id || !user_password || !account_type || !account_password || !value) {
            return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password, value'})
        }
    
        try {
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();
            const TransactionValidator = new TransactionsValidators();
            const TransactionService = new TransactionsServices();

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
    
            if(!await TransactionValidator.checkPositiveFloat(value)) {
                return res.status(400).json({message: 'Please insert a positive numeric value to withdraw, use point (.) instead of comma'})
            }
    
            if(parseFloat(value) < 5) {
                return res.status(400).json({message: 'The minimum ammount to withdraw is 5 BRL'})
            }

            const balance = await AccountService.getAccountFunds(numeric_social_id, account_type, account_password)
    
            if(parseFloat(value) > balance) {
                return res.status(401).json({message: 'Insufficient funds'})
            }
    
            const tax = 4;
    
            const date = new Date();

            if(!await TransactionService.withdrawValue(numeric_social_id, account_type, value)) {
                return res.status(500).json({message: `Could not withdraw value`});
            }

            if(!await TransactionService.registerWithdrawTransaction(numeric_social_id, account_type, value, date, tax)) {
                return res.status(500).json({message: `Could not store transaction`});
            }

            return res.status(200).json({
                message: `Withdrawed succesfully ${value - tax} BRL, a fixed withdraw tax of ${tax} BRL was charged`
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not perform transaction')
        }
    }


    transferFromAccount = async (req: Request, res: Response): Promise<Response> => {
        const { 
            social_id,
            user_password,
            account_type,
            account_password,
            destination_account_id,
            value
        } = req.body;
    
        if(!social_id || !user_password || !account_type || !account_password || !destination_account_id || !value) {
            return res.status(400).json({message: 'Please include the fields social_id, user_password, account_type, account_password, destination_account_id, value'})
        }
    
        try {
            const UserService = new UsersServices();
            const AccountService = new AccountsServices();
            const TransactionValidator = new TransactionsValidators();
            const TransactionService = new TransactionsServices();

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
        
            if(!await TransactionValidator.checkValidUUID(destination_account_id)) {
                return res.status(400).json({message: `The destination account id inserted isn't valid`})
            }
        
            if(!await AccountService.checkAccountExistsByUUID(destination_account_id)) {
                return res.status(401).json({message: `Account ${destination_account_id} doesn't exist`});
            }
    
            if(await AccountService.checkAccountsSameUUID(numeric_social_id, account_type, destination_account_id)) {
                return res.status(401).json({message: `You can't transfer to the same account`});
            }
    
            if(!await TransactionValidator.checkPositiveFloat(value)) {
                return res.status(400).json({message: 'Please insert a positive numeric value to transfer, use point (.) instead of comma'})
            }

            const balance = await AccountService.getAccountFunds(numeric_social_id, account_type, account_password)
    
            if(parseFloat(value) > balance) {
                return res.status(401).json({message: 'Insufficient funds'})
            }
    
            const tax = 1;
    
            const date = new Date();

            if(!await TransactionService.withdrawValue(numeric_social_id, account_type, value)) {
                return res.status(500).json({message: `Could not withdraw value`});
            }

            if(!await TransactionService.depositValueByUUID(destination_account_id, value, tax)) {
                return res.status(500).json({message: `Could not transfer value`});
            }

            if(!await TransactionService.registerTransferTransaction(numeric_social_id, account_type, destination_account_id, value, date, tax)) {
                return res.status(500).json({message: `Could not store transaction`});
            }
    
            return res.status(200).json({
                message: `Transfered succesfully ${value - tax} BRL, a fixed transfer tax of ${tax} BRL was charged`
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json('Could not perform transaction')
        }
    }
}

export { TransactionsController };