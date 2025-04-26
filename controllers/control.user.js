// ALL THINGS RELATED TO HANDLING A USER'S ACCOUNT
import {user as app} from "../models/app.user.js";

export class user{
    
    static getName(req){
        return app.getNickname(req);
    }

    static getSettings(req){
        return app.getSettings(req);
    }

    static editSettings(req){
        return app.editSettings(req);
    }
}