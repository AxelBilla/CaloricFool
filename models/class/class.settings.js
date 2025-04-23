export class Settings{
  constructor(id, unit, theme){
    this.settingid = id;
    this.unit = unit;
    this.theme = theme;
  }
  
  setID(newID){
    this.settingid = newID;
  }
  setUnit(newUnit){
    this.unit = newUnit;
  }
  setTheme(newTheme){
    this.theme = newTheme;
  }
}