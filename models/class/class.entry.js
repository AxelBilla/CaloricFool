class Entries{
  constructor(id, comment, date, user){ // Just in case, you have to get into TS to get private props & meths
    this.entryid = id;
    this.comment = comment;
    this.timeof = date;
    this.user = user; // Instance of class.user's <Users> class
  }

  setID(newID){
    this.entryid = newID;
  }
  setComment(newCom){
    this.comment = newCom;
  }
  setDate(newDate){
    this.timeof = newDate;
  }
  setUser(newUser){
    this.user = newUser;
  }
}

export class Consumptions extends Entries{
  constructor(id, comment, date, user, kcal, gram){
    super(id, comment, date, user);
    this.kcal = kcal;
    this.gram = gram;
  }
  setKcal(newKcal){
    this.kcal = newKcal;
  }
  setGram(newGram){
    this.gram = newGram;
  }
}

export class Activities extends Entries{
  constructor(id, comment, date, user, duration, burnrate){
    super(id, comment, date, user);
    this.duration = duration;
    this.burnrate = burnrate;
  }
  setDuration(newDuration){
    this.duration = newDuration;
  }
  setBurnRate(newRate){
    this.burnrate = newRate;
  }
}