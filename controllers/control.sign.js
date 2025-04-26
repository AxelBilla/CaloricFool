// ALL THINGS RELATED TO HANDLING A USER'S ATTEMPT(S) TO SIGN IN
import {login as app} from "../models/app.log.js";

export class sign{
    static login(req){ // Checks if account with a given email AND assword exists in DB (true/false)
        return app.login(req)
    }

    static register(req){ // Checks if account with a given email exists in DB (true/false)
        return app.register(req);
    }

    static tokenLog(tkn){ // Checks if account with a given email exists in DB (true/false)
        return app.tokenLog(tkn);
    }
}