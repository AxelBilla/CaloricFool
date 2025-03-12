import sql from '../models/db.connect.js'

export class login{

  static async checkLogin(email, pswd){ // Checks if [USER]'s credentials are valid
    let entries=[];
    const request = await sql`
      SELECT EXISTS (SELECT Email FROM users WHERE email=${email} AND password=${pswd})
    `.forEach(row => {
      entries.push(row.exists);
    });
    return entries[0];
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