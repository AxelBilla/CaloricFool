import { login as db_log } from './db.log.js'; 
import { user as db_user } from './db.user.js';
import { entry as db_entry } from './db.entry.js';
import { token as db_token } from './db.token.js';

export class user{
    static async login(req){
        let log = await db_log.checkLogin(req.email, req.password);
        if(log){
            let tkn = await user.addToken(req);
            return {status: log, token: tkn}
        }
        return log; // Returns the result of our request (true/false) depending on if it finds our account or not
    }

    static async register(req){
        const exist = await db_log.getAccount(req.email);
        if(!exist){
            db_log.addAccount(req.user, req.email, req.password)
            let tkn = await user.addToken(req);
            let res = {status: true, token: tkn};
            return res
        }
        return false; // Returns the result of our request (true/false) depending on if it finds our account or not
    }

    static async tokenLog(req){
        var status=false;
        const check = await db_token.checkToken(req.token);
        if(check){
            const val = await db_token.getTokenValidity(req.token);
            const currentDate = new Date();
            const expDate = new Date(val.expiration_date)
            if(expDate>=currentDate){
                status=true;
            }
        }
        return status;
    }     

    static getInfos(req){
        return db_user.getUserInfos(req.token); // Gets every stored informations of a given user
    }

    static async getLastInfo(req){
        let infoExists = await db_user.getUserHasInfo(req.token);
        if(infoExists){
            return db_user.getUserLastInfo(req.token);
        }
        return {}
    }

    static async getNewWeight(req){ // Uses the cons. & acts. entries between now and the last info update to calculate a user's weight
        try{
            var lastInfos = await db_user.getUserLastInfo(req.token); // Gets the latest infos in the db for this user        
            
            const currentDate = new Date(); // Creates a timestamp for the current moment in time
            const infoDate = new Date(lastInfos.updatedate);
            
            const infoDay = infoDate.getDate()+"/"+infoDate.getMonth()+"/"+infoDate.getFullYear();
            const currentDay = currentDate.getDate()+"/"+currentDate.getMonth()+"/"+currentDate.getFullYear();

            if(currentDay!=infoDay){ //Makes sure infos exist & it's actually from this day
                if(lastInfos.bodytype == 0){ // Changes the calcs based on the body type, 0=fem 1=masc. (Revised Harris Benedict)
                    var bmr = 447.593 + (9.247*lastInfos.weight) + (3.098*lastInfos.height) - (4.330*lastInfos.age);
                } else {
                    var bmr = 88.362 + (13.397*lastInfos.weight) + (4.799*lastInfos.height) - (5.677*lastInfos.age);
                }

                var intake = 0; var dayCount = 0;
                var prevDate = new Date(); var newDate = prevDate;
                const lastCons = await db_entry.getEntriesFrom(req.token, "consumptions", infoDate, currentDate);
                lastCons.forEach(entries => {
                    if(dayCount==0){ // Checks if we're on the first entry or not
                        prevDate = new Date(entries.timeof); // Gives prevDate the time value of the first entry
                        dayCount = 1; // dayCount = 1; // Sets dayCount at 1
                    } else {
                        newDate = new Date(entries.timeof); // Gives newDate the time value of the entry n+1
                        if(prevDate<newDate){ // Proceed if newDate is greater than prevDate
                            if(prevDate.getDate()!=newDate.getDate() || prevDate.getMonth!=newDate.getMonth || prevDate.getFullYear!=newDate.getFullYear()){ // Proceed if newDate is not only greater, but also takes place on a different day than prevDate. (Day-wise, 24/10 > 21/11, and 11/10/2025 16:00 == 11/10/2025 18:00)                            prevDate = newDate; // Turns prevDate into this loop's newDate
                                dayCount+=1; // Adds one to our day counter
                            }
                        }
                    }
                    intake+= entries.kcal * (entries.gram/100) ;// Add the calorific value of this entry to our total intake
                });

                const lastActs = await db_entry.getEntriesFrom(req.token, "activities", infoDate, currentDate); // Gets every entries under the category "Activities"
                lastActs.forEach(entries => {intake-= entries.burnRate * (entries.duration/60)}); // Substracts the calories burnt from our total intake

                intake = intake/dayCount; // Divides our intake by the amount of days to get the daily intake (Let us ignore any day without entries, as they most likely were forgotten and not a result of not eating at all (which would be uncommon, but also expected to appear as a 0kcal 0g entry).)
                
                const newWeight = lastInfos.weight+((((intake-(bmr*1.25)))/7700)*dayCount); // Calcs to get someone's new weight. By taking our daily intake and substracting it with our Basal Metabolic Rate multiplied by 1.25(Sendentary PA, chosen since we're handling physical activities ourselves) and dividing that sum by the calorific value of 1kg of fat (7700), we get the amount lost in a day. Which we can then multiply by the number of days and add to our latest weight to calculate our new weight.
                
                lastInfos.weight=newWeight; // Sets our latest infos' weight to our new weight
                lastInfos.updatedate=currentDate; // Sets our latest infos' date to today
                //await db_user.addInfos(req.token, lastInfos); // TO UN-COMMENT ONCE EVERYTHING'S DONE BEING TESTED // Add our new infos to the db
                return newWeight; // temporary testing measure
            } else {
                return 0;
            };
        } catch(e){
            console.log(e)
            return 0;
        }
    }

    static async addToken(req){
        let newToken=generateToken();
        while(db_token.checkToken(newToken)==true){
            newToken=generateToken();
        };

        let time = 1;
        if(req.remember){
            time=31;
        }

        const currentDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate()+time);

        let tknExists = await db_token.hasToken(req.email);
        if(tknExists){
            db_token.remToken(req.email);
            db_token.addToken(newToken, req.email, currentDate, expiryDate);
        } else {
           db_token.addToken(newToken, req.email, currentDate, expiryDate);
        }
        return newToken;
        
    }

    static getSettings(req){
        return db_user.getUserSettings(req.token);
    }

    static getNickname(req){
        return db_user.getNickname(req.token)
    }

    static async getEntries(req){
        let newDate;
        let entries = {cons: await db_entry.getEntries(req.token, "consumptions"), acts: await db_entry.getEntries(req.token, "activities")};
        entries.cons.forEach(el =>{
            newDate = new Date(el.timeof);
            el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()}
        })
        entries.acts.forEach(el =>{
            newDate = new Date(el.timeof);
            el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()}
        })

        return entries;
    }
    static async getEntriesFrom(req){
        let newDate;
        let entries = {cons: await db_entry.getEntriesFrom(req.token, "consumptions", req.startDate, req.endDate), acts: await db_entry.getEntriesFrom(req.token, "activities", req.startDate, req.endDate)};

        entries.cons.forEach(el =>{
            newDate = new Date(el.timeof);
            el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()}
        })
        entries.acts.forEach(el =>{
            newDate = new Date(el.timeof);
            el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()}
        })
        return entries;
    }
}

function generateToken(){
    return Array.from(Array(50), () => Math.floor(Math.random() * 36).toString(36)).join('');
}