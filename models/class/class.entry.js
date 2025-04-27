class Entries{
  constructor(comment, date, id=0, user=0){ // Just in case, you have to get into TS to get private props & meths
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
  constructor(comment, date, kcal, gram, id=0, user=0){
    super(comment, date, id, user);
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
  constructor(comment, date, duration, burnrate, id=0, user=0){
    super(comment, date, id, user);
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