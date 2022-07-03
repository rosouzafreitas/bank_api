"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
class UserServices {
    constructor() {
        this.checkDate = (date) => {
            const date_regex = /^((?:(?=29[\/\-.]0?2[\/\-.](?:[1-9]\d)?(?:[02468][048]|[13579][26])(?!\d))29)|(?:(?=31[\/\-.](?!11)0?[13578]|1[02])31)|(?:(?=\d?\d[\/\-.]\d?\d[\/\-.])(?!29[\/\-.]0?2)(?!31)(?:[12][0-9]|30|0?[1-9])))[\/\-.](0?[1-9]|1[0-2])[\/\-.]((?:[1-9]\d)?\d{2})$/;
            if (date_regex.test(date)) {
                return true;
            }
            else
                false;
        };
        this.checkEmail = (email) => {
            const email_regex = /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;
            if (email_regex.test(email)) {
                return true;
            }
            else
                false;
        };
    }
}
exports.UserServices = UserServices;
