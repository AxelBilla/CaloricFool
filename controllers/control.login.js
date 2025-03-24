// ALL THINGS RELATED TO A USER ATTEMPTING TO LOG IN
import {user as mod} from "../models/app.user.js";

export function checkLogin(req){ // Checks if account with a given email AND assword exists in DB (true/false)
    return mod.checkLogin(req)
}

export function getAccount(req){ // Checks if account with a given email exists in DB (true/false)
    return mod.getAccount(req);
}