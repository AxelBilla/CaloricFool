window.addEventListener("load", function(){ // [TEMP] Test Area

  let element = document.getElementById("test"); 
  element.addEventListener("click", function(){
    user.fetchInfos("test2");
    user.newWeight("test2");
    user.checkEmail("mary@mary.com");
    user.checkEmail("bogusemail");

  });
});

class user{
  static login(form){
    const req = fetch("/login",{
      method: "POST",
      body: JSON.stringify({email: form.target[0].value, password: form.target[1].value, remember: form.target[3].checked}),
      headers: {"Content-Type": "application/json"} 
    });
    console.log(req)
    localStorage.setItem("token", req.token);
    console.log("was given tkn: ", req.token)
    return req;
  }

  static register(form){
    const req = fetch("/register",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({user: form.target[0].value, email: form.target[1].value, password: form.target[2].value, remember: form.target[4].checked}), // Gives the content of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    });
    console.log(req)
    localStorage.setItem("token", req.token);
    console.log("was given tkn: ", req.token);
    return req;
  }

  static tokenLog(){
    const tkn = localStorage.getItem("token");
    const req = fetch("/tokenLog",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({token: tkn}), // Gives the content of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    });
    console.log("logged as tkn: ", tkn)
    return req;
  }
  
  static fetchInfos(tkn){
    const req = fetch("/fetchInfos",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    return req;
  }
  
  static newWeight(tkn){
    const req = fetch("/newWeight",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    });
    return req;
  }
}

class utils{
  static toLBS(num){ // Convert a KG to LBS
    return num*2.20462262185;
  }
  static roundNum(num){ // Round up to the 3rd decimal
    return Math.round(num * 1000) / 1000;
  }
}