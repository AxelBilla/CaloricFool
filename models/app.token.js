import { token as db_token } from './db/db.token.js';
import {Tokens} from './class/class.tokens.js';

export class token{

    static async giveToken(req){
        try{
            let newTokenID=token.generateToken(); // Generates a new token
            while(db_token.checkToken(newTokenID)==true){
                newTokenID=token.generateToken(); // Keeps on generating new tokens until we happen on one that's not already in use (Low probability of this loop to ever be used)
            };

            let time = 1;
            if(req.remember){
                time=31; // Sets the length of a token's lifespan based on whether someone clicked on the "Remember me?" check or not (31d if so, otherwise only 1d)
            }

            const currentDate = new Date();
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate()+time); // Sets the expiration date to be today's date + the length of the token's lifespan (1||31d)

            let tkn = await db_token.hasToken(req.email); // Checks if an account already has a token
            if(tkn.exists){
                const val = await db_token.getTokenValidity(tkn.token); // If so, check it's still valid
                const currentDate = new Date();
                const expDate = new Date(val.expiration_date)
                if(expDate>=currentDate){ // Checks if expDate is superior,
                    if((expDate.getTime()-currentDate.getTime())<86400000){ // and if it is so by stricly more than a day (86.400.000 miliseconds)
                        currentDate.setDate(currentDate.getDate()+1)
                        db_token.updateTokenExpiration(tkn.token, currentDate); // Adds +1 day to the token's lifespan if it's still valid    
                    }
                    newTokenID=tkn.token; // Give back the same token, as it'll still be valid for the next 24h (minimum)
                } else {
                    let newToken = new Tokens(newTokenID, currentDate, expiryDate);
                    db_token.remToken(req.email); // If the token is expired, delete it
                    db_token.addToken(newToken, req.email); // And create a new one for the user to use
                }
            } else {
            let newToken = new Tokens(newTokenID, currentDate, expiryDate);
            db_token.addToken(newToken, req.email); // If the user doesn't have a token, create one for them
            }
            return newTokenID; // Give out the newly create
        } catch (e) {
            console.log(e)
            return;
        }
        
    }
    
    static generateToken(){ // Generates a random 50 character-long string
        try{
            return Array.from(Array(50), () => Math.floor(Math.random() * 36).toString(36)).join('');
        } catch (e) {
            console.log(e);
            return "n/a";
        }
    };
}