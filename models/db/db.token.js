import sql from './db.connect.js'

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

  static async addToken(token, email, currentDate, expiryDate){ // Creates a [USER]'s "Token" after logging in
    const request = await sql`
      INSERT INTO Tokens VALUES(${token}, ${currentDate}, ${expiryDate}, (SELECT userid FROM users WHERE email=${email}))
    `
    return {status: true};
  }
  
  static async remToken(email){
    const request = await sql`
      DELETE FROM Tokens WHERE userid=(SELECT userid FROM Users WHERE email=${email})
    `
    return {status: true};
  }

  static async updateTokenExpiration(token, newDate){
    const request = await sql`
      UPDATE tokens SET expiration_date=${newDate} WHERE tokenid=${token}
    `
    return {status: true};
  }

  static async hasToken(email){
    const request = await sql`
    SELECT EXISTS (SELECT t.userid FROM Tokens t, Users u WHERE t.userid=u.userid AND u.email=${email}), tokenid FROM Tokens t, Users u WHERE t.userid=u.userid AND u.email=${email}
    `
    console.log(request)
    return {status: true, exists: request[0].exists, token: request[0].tokenid};
  }

}
