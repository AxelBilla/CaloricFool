// ALL THINGS RELATED TO HANDLING A USER'S INFOS
import {information as app} from "../models/app.information.js";

export class info{
    static getInfos(req){
        return app.getInfos(req);
    }

    static getLastInfo(req){
        return app.getLastInfo(req);
    }

    static getInfoFrom(req){
        return app.getInfoFrom(req);
    }

    static addInfo(req){
        return app.addInfo(req, req.date);
    }
}