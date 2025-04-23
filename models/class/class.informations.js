export class Informations{
  constructor(id, bodytype, age, weight, height, date, user){
    this.informationid=id;
    this.bodytype = bodytype;
    this.age = age;
    this.weight = weight;
    this.height = height
    this.updatedate = date;
    this.user=user; // Instance of class.user's <Users> class
  }

  setID(newID){
    this.informationid = newID;
  }
  setBodytype(newType){
    this.bodytype = newType;
  }
  setAge(newAge){
    this.age = newAge;
  }
  setWeight(newWeight){
    this.weight = newWeight;
  }
  setHeight(newHeight){
    this.height = newHeight;
  }
  setUpdateDate(newDate){
    this.updatedate = newDate;
  }
  setUser(newUser){
    this.user = newUser;
  }
}