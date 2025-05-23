export class Users{
  constructor(name, mail, password, settings=1, userid=0){
    this.userid = userid;
    this.nickname = name;
    this.email = mail;
    this.password = password;
    this.settings = settings; // Instance of class.settings's <Settings> class
  }
  
  setID(newID){
    this.userid = newID;
  }
  setNickname(newName){
    this.nickname = newName;
  }
  setEmail(newMail){
    this.email = newMail;
  }
  setPassword(newPass){
    this.password = newPass;
  }
  setSettings(newSettings){
    this.settings = newSettings;
  }
}