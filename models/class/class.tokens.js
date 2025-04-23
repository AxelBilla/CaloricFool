export class Tokens{
  constructor(id, creation, expiration, user){
    this.tokenid=id;
    this.creationdate=creation;
    this.expiration_date=expiration
    this.user=user; // Instance of class.user's <Users> class
  }

  setID(newID){
    this.tokenid = newID;
  }
  setCreationDate(newDate){
    this.creationdate = newDate;
  }
  setExpirationDate(newDate){
    this.expiration_date = newDate;
  }
  setUser(newUser){
    this.user = newUser;
  }
}