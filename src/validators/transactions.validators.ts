
class TransactionsValidators {
    checkPositiveFloat = async (value:string) => {
        const regex = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
        if(regex.test(value)) {
            return true;
        } else return false;
    }

    checkValidUUID = async (uuid:string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if(regex.test(uuid)) {
            return true;
        } else return false;
    }
}

export { TransactionsValidators }