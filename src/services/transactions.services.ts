import { TransactionRepository } from "../repositories/transactions.repository";

class TransactionsServices {
    depositValue = async (social_id:string, account_type:string, value:string, tax:number) => {
        const repository = new TransactionRepository();
        if(await repository.depositIntoAccount(social_id, account_type, value, tax)) {
            return true;
        } else return false;
    }

    depositValueByUUID = async (id:string, value:string, tax:number) => {
        const repository = new TransactionRepository();
        if(await repository.depositIntoAccountByUUID(id, value, tax)) {
            return true;
        } else return false;
    }

    withdrawValue = async (social_id:string, account_type:string, value:string) => {
        const repository = new TransactionRepository();
        if(await repository.withdrawFromAccount(social_id, account_type, value)) {
            return true;
        } else return false;
    }

    registerDepositTransaction = async (social_id:string, account_type:string, value:string, date:Date, tax:number) => {
        const repository = new TransactionRepository();
        if(await repository.storeDeposit(social_id, account_type, value, date, tax)) {
            return true;
        } else return false;
    }

    registerWithdrawTransaction = async (social_id:string, account_type:string, value:string, date:Date, tax:number) => {
        const repository = new TransactionRepository();
        if(await repository.storeWithdraw(social_id, account_type, value, date, tax)) {
            return true;
        } else return false;
    }

    registerTransferTransaction = async (social_id:string, account_type:string, destination_id:string, value:string, date:Date, tax:number) => {
        const repository = new TransactionRepository();
        if(await repository.storeTransfer(social_id, account_type, destination_id, value, date, tax)) {
            return true;
        } else return false;
    }
}

export { TransactionsServices }