import sql from '../models/db.connect.js'
import { user } from './db.user.js';

export class entry{

  static async getEntries(userToken, entryName){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    let entries=[];
    const request = await sql`
      SELECT x.* FROM ${sql(entryName)} x, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=x.userid
    `.forEach(row => {
      delete row.userid;
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
      entries.push(row);
    });
    return entries;
  }

  static async addEntry(userToken, entryName, primary, secondary, comment, date){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    const request = await sql`SELECT MAX(entryid)+1 AS value FROM ${sql(entryName)}`;
    await sql`
      INSERT INTO ${sql(entryName)} VALUES(${request[0].value}, ${primary}, ${secondary}, ${comment}, ${date}, (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
    `
    let entry;
    if(entryName=="consumptions"){
      entry={entryid: request[0].value, type: entryName, gram: primary, kcal: secondary, comment: comment, timeof: date}
    } else {
      entry={entryid: request[0].value, type: entryName, duration: primary, burnrate: secondary, comment: comment, timeof: date}
    }
    return {status: true, entry: entry};
  }

  static async editEntry(userToken, req){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    const request = await sql`
      UPDATE ${sql(req.type.name)} SET ${sql(req.type.primary)}=${req.primary}, ${sql(req.type.secondary)}=${req.secondary}, comment=${req.comment} WHERE entryid=${req.id} AND userid=(SELECT userid FROM tokens WHERE tokenid=${userToken})
    `
    return {status: true};
  }

  static async deleteEntry(userToken, req){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    const request = await sql`
      DELETE FROM ${sql(req.type)} WHERE entryid=${req.id} AND userid=(SELECT userid FROM tokens WHERE tokenid=${userToken})
    `
    return {status: true};
  }

}