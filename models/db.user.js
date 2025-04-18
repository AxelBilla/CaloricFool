import sql from '../models/db.connect.js';

export class user{

  static async getNickname(userToken){
    const request = await sql`
    SELECT u.nickname FROM users u, tokens t WHERE u.userid=t.userid AND t.tokenid=${userToken}
    `
    return request[0].nickname;
  }

  static async getUserSettings(userToken){ // Gets [USER]'s settings
    const request = await sql`
      SELECT s.* FROM Settings s, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.settingid=s.settingid
    `
    return request[0];
  }

  static async getUserInfos(userToken){ // Gets every entry of [USER] in the "Informations" table
    let entries=[];
    const request = await sql`
      SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid
    `.forEach(row => {
      delete row.userid;
      delete row.informationid;
      entries.push(row);
    });
    return entries;
  }

  static async getUserLastInfo(userToken){ // Gets the latest entry of [USER] in the "Informations" table
    const request = await sql`
      SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid ORDER BY UpdateDate DESC limit 1
    `
    let entry = request[0];
    delete entry.userid;
    delete entry.informationid;
    return entry;
  }

  static async getUserInfoFrom(maxDate, userToken){ // Gets the latest entry of [USER] in the "Informations" table
    let request = await sql`
      SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid AND (i.UpdateDate <= ${maxDate}) ORDER BY UpdateDate DESC limit 1
    `
    if(request==""){
      request = await sql`
      SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid AND (i.UpdateDate >= ${maxDate}) ORDER BY UpdateDate ASC limit 1
    `
    }
    let entry = request[0];
    delete entry.userid;
    delete entry.informationid;
    return entry;
  }

  static async getUserHasInfo(userToken){ // Checks if [USER] has an account
    let entries=[];
    const request = await sql`
      SELECT EXISTS (SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid limit 1)
    `.forEach(row => {
      entries.push(row.exists);
    });
    return entries[0];
  }

  static async addInfo(userToken, newInfo, date){
    const request = await sql`
      INSERT INTO Informations VALUES((SELECT MAX(InformationID) FROM Informations)+1, ${newInfo.bodytype}, ${newInfo.age}, ${newInfo.weight}, ${newInfo.height}, ${date}, (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
    `
    return {status: true};
  }

}