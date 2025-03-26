import sql from '../models/db.connect.js';

export class token{

  static async getTokenValidity(userToken){ // Used to check if [USER]'s token is expired or  not
    const request = await sql`
      SELECT creationdate, expiration_date FROM Tokens WHERE tokenid=${userToken}
    `;
    return request[0];
  }

  static async checkToken(userToken){ // Check if token exists
    const request = await sql`
      SELECT EXISTS (SELECT tokenid FROM Tokens WHERE tokenid=${userToken})
    `
    return request[0].exists;
  }

  static async addToken(token, len, email){ // Creates a [USER]'s "Token" after logging in
    const currentDate = new Date();
    const expiryDate = currentDate;
    expiryDate.setDate(expiryDate.getDate()+len);
    const request = await sql`
      INSERT INTO Tokens VALUES(${token}, ${currentDate}, ${expiryDate}, (SELECT userid FROM users WHERE email=${email}))
    `
    return true
  }
  
  static async remToken(email){
    const request = await sql`
      DELETE FROM Tokens WHERE userid=(SELECT userid FROM Users WHERE email=${email})
    `
    return request;
  }


  static async hasToken(email){
    const request = await sql`
    SELECT EXISTS (SELECT t.userid FROM Tokens t, Users u WHERE t.userid=u.userid AND u.email=${email})
    `
    return request[0].exists;
  }

}