import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcrypt";
const saltRounds = 10;

import { pool } from "../database";

// new
import { Account, Message, User } from "../models";

// import {} from './repositories';
class CreateUser {
  name;
  birth_date;
  email;
  numeric_social_id;
  hashPassword;
  constructor(user: User) {
    this.name = user.name;
    this.birth_date = user.birth_date;
    this.email = user.email;
    this.numeric_social_id = user.numeric_social_id;
    this.hashPassword = user.hashPassword;
  }
  validateDate(birth_date: string) {
    const date_regex =
      /^((?:(?=29[\/\-.]0?2[\/\-.](?:[1-9]\d)?(?:[02468][048]|[13579][26])(?!\d))29)|(?:(?=31[\/\-.](?!11)0?[13578]|1[02])31)|(?:(?=\d?\d[\/\-.]\d?\d[\/\-.])(?!29[\/\-.]0?2)(?!31)(?:[12][0-9]|30|0?[1-9])))[\/\-.](0?[1-9]|1[0-2])[\/\-.]((?:[1-9]\d)?\d{2})$/;

    if (date_regex.test(birth_date)) {
      return true;
    } else {
      throw new Error(
        "Please insert a valid birth date in the format DD/MM/YYYY"
      );
    }
  }

  validateEmail(email: string) {
    const email_regex =
      /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;

    if (email_regex.test(email)) {
      return true;
    } else {
      throw new Error("Please insert a valid e-mail address");
    }
  }

  async validateSocialId(social_id: number) {
    const social_id_regex = /(\d{3})[.]?(\d{3})[.]?(\d{3})[-]?(\d{2})/gm;

    if (!social_id_regex.test(social_id)) {
      throw new Error("Please insert a valid social id");
    }

    let numeric_social_id = social_id.split(".").join("");
    numeric_social_id = numeric_social_id.split("-").join("");

    if (numeric_social_id.length > 11) {
      throw new Error("Please insert an 11 digit social id");
      // return res
      //   .status(400)
      //   .json({ message: "Please insert an 11 digit social id" });
    }

    const user: QueryResult = await pool.query(
      "SELECT * FROM users WHERE social_id = $1",
      [numeric_social_id]
    );

    if (user.rows[0]) {
      throw new Error("Social ID already in use");
      // return res.status(401).json({ message: "Social ID already in use" });
    }

    return (this.numeric_social_id = numeric_social_id);
  }

  async validatePassword(password: number) {
    const password_regex = /^\d+$/;

    if (
      password.length < 6 ||
      password.length > 6 ||
      !password_regex.test(password)
    ) {
      throw new Error("Please insert a 6-digit numeric password");
      // return res
      //   .status(400)
      //   .json({ message: "Please insert a 6-digit numeric password" });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    return (this.hashPassword = hashPassword);
  }

  async writeData() {
    const response: QueryResult = await pool.query(
      "INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        uuidv4(),
        this.name,
        this.birth_date,
        this.email,
        this.numeric_social_id,
        this.hashPassword,
      ]
    );
  }
}

export { CreateUser };

// try {
//   const { name, birth_date, email, social_id, password } = req.body;

//   const date_regex =
//     /^((?:(?=29[\/\-.]0?2[\/\-.](?:[1-9]\d)?(?:[02468][048]|[13579][26])(?!\d))29)|(?:(?=31[\/\-.](?!11)0?[13578]|1[02])31)|(?:(?=\d?\d[\/\-.]\d?\d[\/\-.])(?!29[\/\-.]0?2)(?!31)(?:[12][0-9]|30|0?[1-9])))[\/\-.](0?[1-9]|1[0-2])[\/\-.]((?:[1-9]\d)?\d{2})$/;

//   if (!date_regex.test(birth_date)) {
//     return res
//       .status(400)
//       .json({
//         message:
//           "Please insert a valid birth date in the format DD/MM/YYYY",
//       });
//   }

//   const email_regex =
//     /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;

//   if (!email_regex.test(email)) {
//     return res
//       .status(400)
//       .json({ message: "Please insert a valid e-mail address" });
//   }

//   const social_id_regex = /(\d{3})[.]?(\d{3})[.]?(\d{3})[-]?(\d{2})/gm;

//   if (!social_id_regex.test(social_id)) {
//     return res
//       .status(400)
//       .json({ message: "Please insert a valid social id" });
//   }

//   let numeric_social_id = social_id.split(".").join("");
//   numeric_social_id = numeric_social_id.split("-").join("");

//   if (numeric_social_id.length > 11) {
//     return res
//       .status(400)
//       .json({ message: "Please insert an 11 digit social id" });
//   }

//   const user: QueryResult = await pool.query(
//     "SELECT * FROM users WHERE social_id = $1",
//     [numeric_social_id]
//   );

//   if (user.rows[0]) {
//     return res.status(401).json({ message: "Social ID already in use" });
//   }

//   const password_regex = /^\d+$/;

//   if (
//     password.length < 6 ||
//     password.length > 6 ||
//     !password_regex.test(password)
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Please insert a 6-digit numeric password" });
//   }

//   const hashPassword = await bcrypt.hash(password, saltRounds);

//   const response: QueryResult = await pool.query(
//     "INSERT INTO users (id, name, birth_date, email, social_id, password) VALUES ($1, $2, $3, $4, $5, $6)",
//     [uuidv4(), name, birth_date, email, numeric_social_id, hashPassword]
//   );
//   return res.status(200).json({
//     body: {
//       user: {
//         name,
//         birth_date,
//         email,
//         social_id,
//         password,
//       },
//     },
//     message: "User created succesfully",
//   });
// } catch (e) {
//   console.log(e);
//   return res.status(500).json({ message: "Could not create user" });
// }
