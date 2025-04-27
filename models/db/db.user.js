import sql from './db.connect.js'
import {Settings} from '../class/class.settings.js'

export class user{

  static async getNickname(userToken){
    try{
      const request = await sql`
      SELECT u.nickname FROM users u, tokens t WHERE u.userid=t.userid AND t.tokenid=${userToken}
      `
      return request[0].nickname; 
    } catch (e) {
      console.log(e)
      return "n/a";
    }
  }

  static async getUserSettings(userToken){ // Gets [USER]'s settings
    try{
      const request = await sql`
        SELECT s.* FROM Settings s, Users u, Tokens t WHERE t.tokenid=${userToken} AND t.userid=u.userid AND u.settingid=s.settingid
      `
      let newSettings = new Settings(request[0].settingid, request[0].unit, request[0].theme);
      return newSettings; 
    } catch (e) {
      console.log(e)
      return;
    }
  }
  
  static async editSettings(userToken, newSettings){
    try{
      const request = await sql`
        UPDATE users SET settingid=(SELECT settingid FROM settings WHERE unit=${newSettings.unit} AND theme=${newSettings.theme}) WHERE userid=(SELECT userid FROM tokens WHERE tokenid=${userToken})
      `
      return {status: true}; 
    } catch (e) {
      console.log(e)
      return {status: false};
    }
  }
}