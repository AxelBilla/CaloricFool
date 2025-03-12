import {user as mod} from "../models/app.user.js";

export function getAccount(req){
    return mod.getAccount(req);
}
export function getInfos(req){
    return mod.getInfos(req);
}
export function getNewWeight(req){
    return mod.getNewWeight(req);
}
export function checkLogin(req){
    return mod.checkLogin(req)
}