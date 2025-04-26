import sql from './db.connect.js'

export class information{

  static async getUserInfos(userToken){ // Gets every entry of [USER] in the "Informations" table
    let entries=[];
    try{
      const request = await sql`
        SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid
      `.forEach(row => {
        delete row.userid;
        delete row.informationid;
        entries.push(row);
      });
    }catch(e){
      console.log(e)
    }
    return entries;
  }

  static async getUserLastInfo(userToken){ // Gets the latest entry of [USER] in the "Informations" table
    let entry;
    try{
      const request = await sql`
        SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid ORDER BY UpdateDate DESC limit 1
      `
      entry = request[0];
      delete entry.userid;
      delete entry.informationid;
    }catch(e){
      console.log(e)
    }
    return entry;
  }

  static async getUserInfoFrom(maxDate, userToken){ // Gets the latest entry of [USER] in the "Informations" table
    let entry;
    try{
      let request = await sql`
        SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid AND (i.UpdateDate <= ${maxDate}) ORDER BY UpdateDate DESC limit 1
      `
      if(request==""){
        request = await sql`
        SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid AND (i.UpdateDate >= ${maxDate}) ORDER BY UpdateDate ASC limit 1
      `
      }
      entry = request[0];
      delete entry.userid;
      delete entry.informationid;
    }catch(e){
      console.log(e)
    }
    return entry;
  }

  static async getUserHasInfo(userToken){ // Checks if [USER] has an account
    let entries=[];
    try{
      const request = await sql`
        SELECT EXISTS (SELECT i.* FROM Informations i, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=i.userid limit 1)
      `.forEach(row => {
        entries.push(row.exists);
      });
    }catch(e){
      console.log(e)
    }
    return entries[0];
  }

  static async addInfo(userToken, newInfo, date){
    try{
      const request = await sql`
        INSERT INTO Informations VALUES((SELECT MAX(InformationID) FROM Informations)+1, ${newInfo.bodytype}, ${newInfo.age}, ${newInfo.weight}, ${newInfo.height}, ${date}, (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
      `
    }catch(e){
      console.log(e)
      return {status: false}
    }
    return {status: true};
  }

}