import sql from '../models/db.connect.js'

export class user{

  static async getUserSettings(userToken){ // Gets [USER]'s settings
    let entries=[]
    const request = await sql`
      SELECT s.* FROM Settings s, Users u WHERE u.token=${userToken} AND u.settingid=s.settingid
    `.forEach(row => {
      entries.push(row)
    });
    return entries
  }

  static async getUserInfos(userToken){ // Gets every entry of [USER] in the "Informations" table
    let entries=[]
    const request = await sql`
      SELECT i.* FROM Informations i, Users u WHERE u.token=${userToken} AND u.userid=i.userid
    `.forEach(row => {
      entries.push(row)
    });
    return entries
  }

  static async getUserLastInfo(userToken){ // Gets the latest entry of [USER] in the "Informations" table
    let entries=[]
    const request = await sql`
      SELECT i.* FROM Informations i, Users u WHERE u.token=${userToken} AND u.userid=i.userid ORDER BY UpdateDate DESC limit 1
    `.forEach(row => {
      entries.push(row)
    });
    return entries
  }

  static async giveToken(email, newToken){ // Creates a [USER]'s account after Signup
    const request = await sql`
      UPDATE Users SET token=${newToken} WHERE email=${email}
    `
  }

  static async addInfos(userToken, newInfos){
    const request = await sql`
      INSERT INTO Informations VALUE((SELECT MAX(InformationID) FROM Informations)+1, ${newInfos.bodytype}, ${newInfos.age}, ${newInfos.weight}, ${newInfos.height}, ${newInfos.updatedate}, (SELECT userid FROM Users WHERE token=${userToken}))
    `
  }

}