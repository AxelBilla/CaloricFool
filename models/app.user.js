import { login as db_login } from './db.log.js'; 
import { user as db_user } from './db.user.js';
import { entry as db_entry } from './db.entry.js';

export class user{
    static async checkLogin(req){
        const exec = await db_login.checkLogin(req.email, req.password);
        return exec; // Returns the result of our request (true/false) depending on if it finds our account or not
    }
    static async getAccount(req){
        const exec = await db_login.getAccount(req.email);
        return exec; // Returns the result of our request (true/false) depending on if it finds our account or not
    }
    static async getInfos(req){
        return db_user.getUserInfos(req.token); // Gets every stored informations of a given user
    }
    static async getNewWeight(req){ // Uses the cons. & acts. entries between now and the last info update to calculate a user's weight
        var lastInfos = await db_user.getUserLastInfo(req.token); // Gets the latest infos in the db for this user
        if(lastInfos[0].bodytype == 0){ // Changes the calcs based on the body type, 0=fem 1=masc. (Revised Harris Benedict)
            var bmr = 447.593 + (9.247*lastInfos[0].weight) + (3.098*lastInfos[0].height) - (4.330*lastInfos[0].age);
        } else {
            var bmr = 88.362 + (13.397*lastInfos[0].weight) + (4.799*lastInfos[0].height) - (5.677*lastInfos[0].age);
        }

        const currentDay = new Date(); // Creates a timestamp for the current moment in time

        var intake = 0; var dayCount = 0;
        var prevDate = new Date(); var newDate = prevDate;
        const lastCons = await db_entry.getEntriesFrom(req.token, "consumptions", lastInfos[0].updatedate, currentDay);
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

        const lastActs = await db_entry.getEntriesFrom(req.token, "activities", lastInfos[0].updatedate, currentDay); // Gets every entries under the category "Activities"
        lastActs.forEach(entries => {intake-= entries.burnRate * (entries.duration/60)}); // Substracts the calories burnt from our total intake

        intake = intake/dayCount; // Divides our intake by the amount of days to get the daily intake (Let us ignore any day without entries, as they most likely were forgotten and not a result of not eating at all.)
        
        const newWeight = lastInfos[0].weight+((((intake-(bmr*1.25)))/7700)*dayCount); // Calcs to get someone's new weight. By taking our daily intake and substracting it with our Basal Metabolic Rate multiplied by 1.25(Sendentary PA, chosen since we're handling physical activities ourselves) and dividing that sum by the calorific value of 1kg of fat (7700), we get the amount lost in a day. Which we can then multiply by the number of days and add to our latest weight to calculate our new weight.
        
        lastInfos[0].weight=newWeight; // Sets our latest infos' weight to our new weight
        lastInfos[0].updatedate=currentDay; // Sets our latest infos' date to today
        //await db_user.addInfos(req.token, lastInfos[0]); // TO UN-COMMENT ONCE EVERYTHING'S DONE BEING TESTED // Add our new infos to the db
        return newWeight;
    }
}