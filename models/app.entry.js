import { entry as db_entry } from './db/db.entry.js';

export class entry{
    static async getEntries(req){ // Self-explanatory, gets all of a user's entries
        try{
            let newDate;
            let entries = {cons: await db_entry.getEntries(req.token, "consumptions"), acts: await db_entry.getEntries(req.token, "activities")}; // Get all entries for both types (cons & acts)
            entries.cons.forEach(el =>{ // Go through each entries
                newDate = new Date(el.timeof); // Turn their dates into usable objects
                el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()} // Turns that object into a pratical JSON
            })
            entries.acts.forEach(el =>{ // Same thing as above, but for the activities portion this time
                newDate = new Date(el.timeof);
                el.timeof = {day: newDate.getDate(), month: newDate.getMonth()+1, year: newDate.getFullYear(), hour: newDate.getHours(), minute: newDate.getMinutes()}
            })

            return entries;
        } catch (e) {
          console.log(e)
          return;
        }
    }

    static async getEntriesFrom(req){ // Same exact thing as above, except with a smaller dataset (between X & Y dates instead of picking ALL dates)
        try{
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
        } catch (e) {
            console.log(e)
            return;
        }
    }

    static async addEntry(req){ // Adds an entry based on what the user inputted
        try{
            if (req.type==0){
                req.type="consumptions" // Gives it the right data to be used in our request to add an entry, based on a binary integer given by the user (this is the name of the table for that kinda entry)
            } else {
                req.type="activities"
            };
            let date=new Date(req.date) // Turns the date we got from the user into a practical object (Also, this avoids issues with timezones, since we get the actual date from our user's side as a string AND THEN reconstruct it)
            let exec = await db_entry.addEntry(req.token, req.type, req.primaryInfo, req.secondaryInfo, req.comment, req.date)
            exec.entry.timeof = {day: date.getDate(), month: date.getMonth()+1, year: date.getFullYear(), hour: date.getHours(), minute: date.getMinutes()}; // Deconstruct our date into a practical JSON object to be used by the user (A bit wasteful tbh, I could have left that in the front-end and juste reuse the date inputted by the user. Too late now, might make that change later on tho)
            return exec;
        } catch (e) {
            console.log(e)
            return {status: false};
        }
    }

    static async editEntry(req){
        try{
            if(req.type){
                req.type={name: "consumptions", primary: "gram", secondary: "kcal"}; // Same as above, except we have to get the actual names of the field we (might) be updating
            } else {
                req.type={name: "activities", primary: "duration", secondary: "burnrate"};
            }
            return await db_entry.editEntry(req.token, req)
        } catch (e) {
            console.log(e)
            return {status: false};
        }
    }

    static async deleteEntry(req){
        try{
            if(req.type){
                req.type="consumptions"; // You know what I'm about to say, right? SAMEEE
            } else {
                req.type="activities";
            }
            return await db_entry.deleteEntry(req.token, req);
        } catch (e) {
            console.log(e)
            return {status: false};
        }
    }
}