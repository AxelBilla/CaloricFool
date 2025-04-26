// ALL THINGS RELATED TO HANDLING A USER'S ENTRIES
import {entry as app} from "../models/app.entry.js";

export class entry{
    static getEntries(req){
        return app.getEntries(req);
    }

    static getEntriesFrom(req){
        return app.getEntriesFrom(req);
    }

    static addEntry(req){
        return app.addEntry(req);
    }

    static editEntry(req){
        return app.editEntry(req);
    }

    static deleteEntry(req){
        return app.deleteEntry(req);
    }
}