class user{
  static async login(form){
    const req = await fetch("/login",{
      method: "POST",
      body: JSON.stringify({email: form.target[0].value, password: form.target[1].value, remember: form.target[3].checked}),
      headers: {"Content-Type": "application/json"} 
    });
    const res = await req.json()
    localStorage.setItem("token", res.token);
    return res;
  }

  static async register(form){
    const req = await fetch("/register",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({user: form.target[0].value, email: form.target[1].value, password: form.target[2].value, remember: form.target[4].checked}), // Gives the content of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    });
    const res = await req.json()
    localStorage.setItem("token", res.token);
    return res;
  }

  static async tokenLog(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/tokenLog",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({token: tkn}), // Gives the content of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    });
    const res = await req.json()
    return res;
  }
  
  static async getLastInfo(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/getLastInfo",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    console.log("lI: ",res)
    return res;
  }
  
  static async newWeight(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/newWeight",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    return res;
  }

  static async getSettings(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/getSettings",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    console.log("sT: ",res)
    return res;
  }

  static async getName(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/getName",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    console.log("name: ", res)
    return res;
  }

  static async getEntries(){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/getEntries",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    console.log("e: ", res)
    return res;
  }

  static async getEntriesFrom(sDate, eDate){
    const tkn = localStorage.getItem("token");
    const req = await fetch("/getEntriesFrom",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn, startDate: sDate, endDate: eDate}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    const res = await req.json()
    console.log("eF: ", res)
    return res;
  }

}

class utils{
  static toLBS(num){ // Convert a KG to LBS
    return num*2.20462262185;
  }
  static toInch(num){ // Convert a CM to INCHES
    return num/2.54;
  }
  static roundNum(num, decimal=1){ // Round up to the 2nd decimal by default
    return Math.round(num * (10**decimal)) / (10**decimal);
  }
}