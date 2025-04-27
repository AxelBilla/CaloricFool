import { login as db_log } from './db/db.login.js'; 
import { token as db_token } from './db/db.token.js';
import {Users} from './class/class.user.js'

import { token as app_token} from './app.token.js';
import { information as app_info} from './app.information.js';

export class login{
    static async login(req){
        try{
            let log = await db_log.checkLogin(req.email, req.password); // Check if the credentials submitted by a given user are, indeed, that account's
            if(log.status){ // If so,
                let tkn = await app_token.giveToken(req); // Go through the token attribution process
                await app_info.getNewWeight({token: tkn, date: req.date}) // Update a user's weight, if needed
                return {status: log, token: tkn} // Tells the user everything went flawlessly & gives them their (newly generated or not) token
            }
        } catch (e) {
            console.log(e)
        }
        return {status: false};
    }

    static async register(req){
        try{
            const exist = await db_log.getAccount(req.email); // Checks if the account being registred already exists or not
            if(!exist){ // If it doesn't,
                let newAccount = new Users(req.user, req.email, req.password)
                await db_log.addAccount(newAccount) // Create the account with the infos submitted by the user
                let tkn = await app_token.giveToken(req); // Go through the token attribution process
                let res = {status: true, token: tkn};
                return res
            }
        } catch (e) {
            console.log(e)
        }
        return {status: false};
    }

    static async tokenLog(req){
        var status=false;
        try{
            const check = await db_token.checkToken(req.token); // Checks if token exists or not
            if(check){ // If it does,
                const val = await db_token.getTokenValidity(req.token); // Checks if said token is still valid or not
                const currentDate = new Date();
                const expDate = new Date(val.expiration_date) // Turns the expiration date into a practical date object
                if(expDate>=currentDate){ //Checks if the expiration date is greater than (or equal to) the current date
                    if((expDate.getTime()-currentDate.getTime())<86400000){ // Checks if said expiration date the gap is greater than a day (86.400.000 miliseconds)
                        currentDate.setDate(currentDate.getDate()+1)
                        db_token.updateTokenExpiration(req.token, currentDate); // If it is, add +1 day to the token's lifespan (so, as long as you use the app daily, you never need to login again)    
                    }
                    status=true;
                    await app_info.getNewWeight(req) // Update the user's weight, if needed.
                }
            }
        } catch (e) {
            console.log(e)
        }
        return {status: status};
    }     
}