import {user as mod} from "../models/app.user.js";

export async function getAccount(req){
    return mod.getAccount(req);
}
export async function getInfos(req){
    return mod.getInfos(req);
}
export async function getNewWeight(req){
    return mod.getNewWeight(req);
}
