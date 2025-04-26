import { user as db_user } from './db/db.user.js';

export class user{ // Welp, this whole app module is pretty self explanatory ig? 
    static getNickname(req){
        try{
            return db_user.getNickname(req.token); // Gets a user's name
        } catch (e) {
            console.log("{ How the hell did this happen? }", e)
            return "n/a"
        }
    }

    static getSettings(req){
        try{
            return db_user.getUserSettings(req.token); // Gets a user's settings
        } catch (e) {
            console.log("{ How the hell did this happen? }", e)
            return;
        }
    }

    static async editSettings(req){
        try{
            return await db_user.editSettings(req.token, req); // Edits a user's settings
        } catch (e) {
            console.log("{ How the hell did this happen? }", e)
            return {status: false};
        }
    }
}