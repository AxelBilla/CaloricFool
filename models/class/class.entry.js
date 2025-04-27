class Entries{
  constructor(comment, date, id=0, user=0, type=""){ // Just in case, you have to get into TS to get private props & meths
    this.entryid = id;
    this.comment = comment;
    this.timeof = date;
    this.type = type;
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
  setType(newType){
    this.type = newType;
  }
}

export class Consumptions extends Entries{
  constructor(comment, date, kcal, gram, id=0, user=0, type="consumptions"){
    super(comment, date, id, user, type);
    this.kcal = kcal;
    this.gram = gram;
    this.type = type;
  }
  setKcal(newKcal){
    this.kcal = newKcal;
  }
  setGram(newGram){
    this.gram = newGram;
  }
}

export class Activities extends Entries{
  constructor(comment, date, duration, burnrate, id=0, user=0, type="activities"){
    super(comment, date, id, user, type);
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