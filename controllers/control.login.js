// ALL THINGS RELATED TO A USER ATTEMPTING TO LOG IN
import {user as app} from "../models/app.user.js";

export function login(req){ // Checks if account with a given email AND assword exists in DB (true/false)
    return app.login(req)
}

export function register(req){ // Checks if account with a given email exists in DB (true/false)
    return app.register(req);
}

export function tokenLog(tkn){ // Checks if account with a given email exists in DB (true/false)
    return app.tokenLog(tkn);
}