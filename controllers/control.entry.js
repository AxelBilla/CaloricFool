// ALL THINGS RELATED TO GETTING A USER'S INFOS
import {user as mod} from "../models/app.user.js";

export class entry{
    static getEntries(req){
        return mod.getEntries(req);
    }

    static getEntriesFrom(req){
        return mod.getEntriesFrom(req);
    }

    static addEntry(req){
        return mod.addEntry(req);
    }
}