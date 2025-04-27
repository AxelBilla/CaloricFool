class requests{
  static async login(form){
    let date = new Date(); // Deconstructing date so we can send it out without having to worry about timezones
    date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    const req = await fetch("/login",{
      method: "POST",
      body: JSON.stringify({email: form.target[0].value, password: form.target[1].value, remember: form.target[3].checked, date: date}), // Gives the content of request for the server to process
      headers: {"Content-Type": "application/json"}// Tells the type of content we're sending over to our endpoint 
    });
    const res = await req.json()
    localStorage.setItem("token", res.token); // Add the token to the localStorage so we can use it later on
    return res;
  }

  static async register(form){
    const req = await fetch("/register",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({user: form.target[0].value, email: form.target[1].value, password: form.target[2].value, remember: form.target[4].checked}),
      headers: {"Content-Type": "application/json"}
    });
    const res = await req.json()
    localStorage.setItem("token", res.token);  // Same as above
    return res;
  }

  static async tokenLog(){
    let date = new Date();  // Same as above
    date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    const tkn = localStorage.getItem("token"); // Directly gets the token from localStorage
    const req = await fetch("/tokenLog",{
      method: "POST",
      body: JSON.stringify({token: tkn, date: date}),  // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }
  
  static async getLastInfo(){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getLastInfo",{ // Same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }
  
  static async getInfoFrom(maxDate){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getInfoFrom",{ // Same as above
      method: "POST",
      body: JSON.stringify({date: maxDate, token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async getSettings(){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getSettings",{ // Same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async getName(){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getName",{ // Same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async getEntries(){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getEntries",{ // Same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async getEntriesFrom(sDate, eDate){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/getEntriesFrom",{ // Same as above
      method: "POST",
      body: JSON.stringify({token: tkn, startDate: sDate, endDate: eDate}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async addEntry(form, date){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/addEntry",{
      method: "POST",       
      body: JSON.stringify({type: form.target[0].getAttribute("entryType"), primaryInfo: form.target[1].value, secondaryInfo: form.target[2].value, comment: form.target[3].value, date: date, token: tkn}), // 0: Cons/Act; 1: Gram; 2: Kcal; 3: Comment; 4: Date; 5: Hour.
      headers: {"Content-Type": "application/json"}  // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async editEntry(form){
    const tkn = localStorage.getItem("token"); // Same as above
    const req = await fetch("/editEntry",{
      method: "POST",       
      body: JSON.stringify({type: form.type, primary: form.primary, secondary: form.secondary, comment: form.comment, id: form.id, token: tkn}), // 0: Cons/Act; 1: Gram; 2: Kcal; 3: Comment; 4: Date; 5: Hour.
      headers: {"Content-Type": "application/json"} 
    });
    const res = await req.json()
    return res;
  }

  static async deleteEntry(data){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/deleteEntry",{
      method: "POST",       
      body: JSON.stringify({id: data.id, type: data.type, token: tkn}),
      headers: {"Content-Type": "application/json"} 
    });
    const res = await req.json()
    return res;
  }

  static async addInfo(form, date){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/addInfo",{
      method: "POST",       
      body: JSON.stringify({weight: form.target[0].value, height: form.target[1].value, age: form.target[2].value, bodytype: form.target[3].getAttribute("bodyType"), date: date, token: tkn}), // 0: Cons/Act; 1: Gram; 2: Kcal; 3: Comment; 4: Date; 5: Hour.
      headers: {"Content-Type": "application/json"} 
    });
    const res = await req.json()
    return res;
  }

  static async editSettings(){
    const tkn = localStorage.getItem("token");
    const theme = localStorage.getItem("theme");
    const unit = localStorage.getItem("unit");
    const req = await fetch("/editSettings",{
      method: "POST",       
      body: JSON.stringify({theme: theme, unit: unit, token: tkn}),
      headers: {"Content-Type": "application/json"} 
    });
    const res = await req.json()
    return res;
  }

}

class utils{
  static toLBS(num){ // Convert KG to LBS
    return num*2.20462262185;
  }
  
  static toKG(num){ // Convert LBS to KG
    return num*0.45359237;
  }

  static toInch(num){ // Convert CM to INCHES
    return num/2.54;
  }

  static toCM(num){ // Convert INCHES to CM
    return num*2.54;
  }

  static roundNum(num, decimal=1){ // Round up to the 2nd decimal by default
    return Math.round(num * (10**decimal)) / (10**decimal);
  }
}