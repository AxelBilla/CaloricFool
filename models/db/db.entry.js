import sql from './db.connect.js' // BTW, PostgreJS prepares statements automatically (hence why it's never done manually)
import {Consumptions, Activities} from '../class/class.entry.js'

export class entry{

  static async getEntries(userToken, entryName){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    let entries=[];
    try{
      const request = await sql`
        SELECT x.* FROM ${sql(entryName)} x, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=x.userid
      `.forEach(row => {
        let newEntry
        if(entryName === "consumptions"){
          newEntry = new Consumptions(row.comment, row.timeof, row.kcal, row.gram, row.entryid);
        } else {
          newEntry = new Activities(row.comment, row.timeof, row.burnrate, row.duration, row.entryid);
        }
        entries.push(newEntry);
      });
    }catch(e){
      console.log(e)
    }
    return entries;
  }

  static async getEntriesFrom(userToken, entryName, startDate, endDate){ // Gets every entry of [USER] from a given day in either the "Activities" or "Consumptions" a based on a given [entryName]
    let entries=[];
    try{
      const request = await sql`
        SELECT x.* FROM ${sql(entryName)} x, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.userid=x.userid AND (x.timeof BETWEEN ${startDate} AND ${endDate})
      `.forEach(row => {
        let newEntry
        if(entryName === "consumptions"){
          newEntry = new Consumptions(row.comment, row.timeof, row.kcal, row.gram, row.entryid);
        } else {
          newEntry = new Activities(row.comment, row.timeof, row.burnrate, row.duration, row.entryid);
        }
        entries.push(newEntry);
      });
    }catch(e){
      console.log(e)
    }
    return entries;
  }

  static async addEntry(userToken, entry){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    try{
      const request = await sql`SELECT MAX(entryid)+1 AS value FROM ${sql(entry.type)}`;
      entry.setID(request[0].value);
      if(entry.type=="consumptions"){
        await sql`
          INSERT INTO ${sql(entry.type)} VALUES(${entry.entryid}, ${entry.gram}, ${entry.kcal}, ${entry.comment}, ${entry.timeof}, (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
        `
      } else {
        await sql`
          INSERT INTO ${sql(entry.type)} VALUES(${entry.entryid}, ${entry.duration}, ${entry.burnrate}, ${entry.comment}, ${entry.timeof}, (SELECT userid FROM Tokens WHERE tokenid=${userToken}))
        `
      }
    }catch(e){
      console.log(e)
      return {status: false}
    }
    return {status: true, entry: entry};
  }

  static async editEntry(userToken, req){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    try{
      const request = await sql`
        UPDATE ${sql(req.type.name)} SET ${sql(req.type.primary)}=${req.primary}, ${sql(req.type.secondary)}=${req.secondary}, comment=${req.comment} WHERE entryid=${req.id} AND userid=(SELECT userid FROM tokens WHERE tokenid=${userToken})
      `
    }catch(e){
      console.log(e)
      return {status: false}
    }
    return {status: true};
  }

  static async deleteEntry(userToken, req){ // Gets every entry of [USER] in either the "Activities" or "Consumptions" table based on a given [entryName]
    try{
      const request = await sql`
        DELETE FROM ${sql(req.type)} WHERE entryid=${req.id} AND userid=(SELECT userid FROM tokens WHERE tokenid=${userToken})
      `
    }catch(e){
      console.log(e)
      return {status: false}
    }
    return {status: true};
  }

}