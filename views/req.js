window.addEventListener("load", function(){ // [TEMP] Test Area

  let element = document.getElementById("test"); 
  element.addEventListener("click", function(){
    user.fetchInfos("test2");
    user.newWeightTemp("test2");
    user.checkEmail("mary@mary.com");
    user.checkEmail("bogusemail");

  });

  $('#sign-login-menu-fields-form').submit(function(e) {
    e.preventDefault();
    user.checkLogin(e);
  })
});

class user{
  static async checkLogin(form){
    const req = fetch("/login",{
      method: "POST",
      body: JSON.stringify({email: form.target[0].value, password: form.target[1].value, remember: form.target[3].checked}),
      headers: {"Content-Type": "application/json"} 
    })
    return req;
  }

  static async checkEmail(addr){
    fetch("/checkEmail",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({email: addr}), // Gives the content of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    }).then(resp => resp.json().then(data => console.log("getAccount: "+data))) //[TEMP] .then() is only used rn to test, its returned data will be handled outside
  }
  
  static async fetchInfos(tkn){
    fetch("/fetchInfos",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp => resp.json().then(data => {
      const test = document.getElementById("test");
      data.forEach(el => {
        console.log("getInfos: "+el.bodytype+"/"+el.age+"/"+el.weight+"/"+el.height+"/"+el.updatedate)
      })
    }));
  }
  
  static async newWeight(tkn){
    fetch("/newWeight",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp => resp.json().then(data => console.log("getNewWeight: "+utils.roundNum(data))));
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