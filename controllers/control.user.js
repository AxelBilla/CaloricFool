import {user as mod} from "../models/app.user.js";

export function getInfos(req){
    return mod.getInfos(req);
}

export function getNewWeight(req){
    return mod.getNewWeight(req);
}