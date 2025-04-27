import { information as db_info } from './db/db.information.js';
import { entry as db_entry } from './db/db.entry.js';

export class information{  

    static async getInfos(req){
        try{
            let infoExists = await db_info.getUserHasInfo(req.token);
            if(infoExists){
                return db_info.getUserInfos(req.token); // Gets every stored informations of a given user
            }
        } catch (e) {
            console.log(e)
        }
        return {status: false};
    }

    static async getLastInfo(req){
        try{
            let infoExists = await db_info.getUserHasInfo(req.token);
            if(infoExists){
                return db_info.getUserLastInfo(req.token); // ONLY gets the newest informations of a given user
            }
        } catch (e) {
            console.log(e)
        }
        return {status: false};
    }

    static async getInfoFrom(req){
        try{
            let infoExists = await db_info.getUserHasInfo(req.token);
            if(infoExists){
                return db_info.getUserInfoFrom(req.date, req.token); // ONLY gets the informations of a given user, on a given date
            }
        } catch (e) {
            console.log(e)
        }
        return {status: false};
    }

    static async addInfo(req, date){
        try{
            let toDate = new Date(date) // Turns the date we got from the user into a practical object (Also, this avoids issues with timezones, since we get the actual date from our user's side as a string AND THEN reconstruct it)
            req["updatedate"] = toDate;
            return await db_info.addInfo(req.token, req)
        } catch (e) {
            console.log(e)
            return {status: false}
        }
    }

    static async getNewWeight(req){ // Uses the cons. & acts. entries between now and the last info update to calculate a user's weight
        try{
            var lastInfos = await db_info.getUserLastInfo(req.token); // Gets the latest infos in the db for this user        

            let currentDate = new Date(req.date); // Creates a timestamp for the current moment in time
            const currentDay = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate();
            currentDate = new Date(currentDay);
            currentDate.setMilliseconds(currentDate.getMilliseconds()-1); // Makes it so all entries will be from before today

            let infoDate = new Date(lastInfos.updatedate);
            const infoDay = infoDate.getFullYear()+"-"+(infoDate.getMonth()+1)+"-"+infoDate.getDate();

            if(currentDay!=infoDay){ //Makes sure infos exist & it's actually from this day
                infoDate = new Date(infoDate.getFullYear()+"-"+(infoDate.getMonth()+1)+"-"+infoDate.getDate()); // Make it so all entries are accounted for, even those on the same day but prior to a new entry being made (i.e, if you messed up and want to update your infos, it won't have an adverse effect on the next weight update for today's entries)

                if(lastInfos.bodytype == 0){ // Changes the calcs based on the body type, 0=fem 1=masc. (Revised Harris Benedict)
                    var bmr = 447.593 + (9.247*lastInfos.weight) + (3.098*lastInfos.height) - (4.330*lastInfos.age);
                } else {
                    var bmr = 88.362 + (13.397*lastInfos.weight) + (4.799*lastInfos.height) - (5.677*lastInfos.age);
                }

                let intake = 0; let dayList=[];
                const lastCons = await db_entry.getEntriesFrom(req.token, "consumptions", infoDate, currentDate);
                lastCons.forEach(entries => {
                    let day = entries.timeof.getFullYear()+"-"+(entries.timeof.getMonth()+1)+"-"+entries.timeof.getDate();
                    if(dayList.length===0){ // Checks if we're on the first entry or not
                        dayList.push(day) // If so add day to list of days
                    } else {
                        if(!dayList.includes(day)){ // Checks if this day is our list of days
                            dayList.push(day) // If not, add this day to the list
                        }
                    }
                    intake+= entries.kcal * (entries.gram/100) ;// Add the calorific value of this entry to our total intake
                });

                const lastActs = await db_entry.getEntriesFrom(req.token, "activities", infoDate, currentDate); // Gets every entries under the category "Activities"
                lastActs.forEach(entries => {intake-= (entries.burnrate * (entries.duration/60))}); // Substracts the calories burnt from our total intake
                
                intake = intake/dayList.length; // Divides our intake by the amount of days to get the daily intake (Let us ignore any day without entries, as they most likely were forgotten and not a result of not eating at all (which would be uncommon, but also expected to appear as a 0kcal 0g entry).)
                const newWeight = lastInfos.weight+((((intake-(bmr*1.2)))/7700)*dayList.length); // Calcs to get someone's new weight. By taking our daily intake and substracting it with our Basal Metabolic Rate multiplied by 1.25(Sendentary PA, chosen since we're handling physical activities ourselves) and dividing that sum by the calorific value of 1kg of fat (7700), we get the amount lost in a day. Which we can then multiply by the number of days and add to our latest weight to calculate our new weight.
                
                lastInfos.weight=newWeight; // Sets our latest infos' weight to our new weight
                lastInfos.updatedate=req.date; // Sets our latest infos' date to today
                return await db_info.addInfo(req.token, lastInfos); // TO UN-COMMENT ONCE EVERYTHING'S DONE BEING TESTED // Add our new infos to the db
            } else {
                return {status: false};
            };
        } catch(e){
            console.log(e)
            return {status: false};
        }
    }

}