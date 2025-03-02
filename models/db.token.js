import sql from '../models/db.connect.js'

export class token{

  static async getTokenValidity(userToken){ // Used to check if [USER]'s token is expired or  not
    let entries=[]
    const request = await sql`
      SELECT CreateDate, ExpiDate FROM Tokens t, Users u WHERE u.token=${userToken} AND u.token=t.tokenid
    `.forEach(row => {
      entries.push(row)
    });
    return entries[0]
  }

  static async checkToken(userToken){ // Creates a [USER]'s account after Signup
    let entries=[]
    const request = await sql`
      SELECT EXISTS (SELECT tokenid FROM Tokens WHERE tokenid=${userToken})
    `.forEach(row => {
      entries.push(row.exists)
    });
    return entries[0]
  }

  static generateToken(){ // Generates a string made up of 50 random characters (A-Z, 0-9)
    return Array.from(Array(50), () => Math.floor(Math.random() * 36).toString(36)).join('');
  }

  static async addToken(token){ // Creates a [USER]'s "Token" after logging in
    const currentDate = new Date();
    const expiryDate = currentDate;
    expiryDate.setHours(expiryDate.getHours()+3)
    const request = await sql`
      INSERT INTO Tokens VALUES(${token}, ${currentDate}, ${expiryDate})
    `
  }

  static async addLongToken(token){ // Creates a [USER]'s account after Signup
    const currentDate = new Date();
    const expiryDate = currentDate;
    expiryDate.setDate(expiryDate.setDate()+31)
    const request = await sql`
      INSERT INTO Tokens VALUES(${token}, ${currentDate}, ${expiryDate})
    `
  }
  
  static async deleteToken(token){
    //TODO
  }

}