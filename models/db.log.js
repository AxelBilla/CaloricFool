import sql from '../models/db.connect.js'

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');

export class login{

  static async checkLogin(email, pswd){ // Checks if [USER]'s credentials are valid
    const request = await sql`
      SELECT password FROM users WHERE email=${email}
    `
    let res;
    try{
      res={status: await bcrypt.compare(pswd, request[0].password)};
    } catch (e) {
      res={status: false, err: e}
    }
    return res;
  }

  static async getAccount(email){ // Checks if [USER] has an account
    let entries=[];
    const request = await sql`
      SELECT EXISTS (SELECT Email FROM users WHERE email=${email})
    `.forEach(row => {
      entries.push(row.exists);
    });
    return entries[0];
  }

  static async addAccount(nickname, email, password){ // Creates a [USER]'s account after Signup
    const request = await sql`
      INSERT INTO Users VALUES((SELECT MAX(userid) FROM Users)+1, ${nickname}, ${email}, ${password}, 1);
    `
  }

}