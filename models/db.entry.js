import sql from '../models/db.connect.js'

export class entry{

  static async getEntries(userToken, entryName){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    let entries=[];
    const request = await sql`
      SELECT x.* FROM ${sql(entryName)} x, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=x.userid
    `.forEach(row => {
      delete row.userid;
      delete row.entryid;
      entries.push(row);
    });
    return entries;
  }

  static async getEntriesFrom(userToken, entryName, startDate, endDate){ // Gets every entry of [USER] from a given day in either the "Activities" or "Consumptions" a based on a given [entryName]
    let entries=[];
    const request = await sql`
      SELECT x.* FROM ${sql(entryName)} x, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=x.userid AND (x.timeof BETWEEN ${startDate} AND ${endDate})
    `.forEach(row => {
      delete row.userid;
      delete row.entryid;
      entries.push(row);
    });
    return entries;
  }

  static async addEntry(userToken, entryName, gram, kcal, comment, date){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    const request = await sql`
      INSERT INTO ${sql(entryName)} VALUES((SELECT MAX(userid) FROM Users)+1, ${gram}, ${kcal}, ${comment}, to_timestamp(${date}), (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
    `
  }

}