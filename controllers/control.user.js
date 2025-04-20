// ALL THINGS RELATED TO GETTING A USER'S INFOS
import {user as mod} from "../models/app.user.js";

export class user{
    static getInfos(req){
        return mod.getInfos(req);
    }

    static getNewWeight(req){
        return mod.getNewWeight(req);
    }

    static getLastInfo(req){
        return mod.getLastInfo(req);
    }

    static getInfoFrom(req){
        return mod.getInfoFrom(req);
    }

    static getSettings(req){
        return mod.getSettings(req);
    }

    static getName(req){
        return mod.getNickname(req);
    }

    static addInfo(req){
        return mod.addInfo(req, req.date);
    }

    static editSettings(req){
        return mod.editSettings(req);
    }
}