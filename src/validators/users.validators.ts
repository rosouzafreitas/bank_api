
class UsersValidators {
    checkDate = (date:string) => {
        const date_regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

        if(date_regex.test(date)) {
            return true
        } else return false
    }

    checkEmail = (email:string) => {
        const email_regex = /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;

        if(email_regex.test(email)) {
            return true
        } else return false
    }

    checkSocialId = (social_id:string) => {
        const social_id_regex = /(\d{3})[.]?(\d{3})[.]?(\d{3})[-]?(\d{2})/gm;

        let numeric_social_id = social_id.split('.').join("");
        numeric_social_id = numeric_social_id.split('-').join("");

        if(social_id_regex.test(social_id) && numeric_social_id.length == 11) {
            return true;
        } else return false;
    }

    checkUserPassword = (password:string) => {
        const password_regex = /^\d+$/;
        
        if(password.length < 6 || password.length > 6 || !password_regex.test(password)) {
            return false
        } else return true
    }
}

export { UsersValidators }