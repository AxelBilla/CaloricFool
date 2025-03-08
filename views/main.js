window.addEventListener("load", function(){

  let element = document.getElementById("garg"); 
  element.addEventListener("click", function(){
    element.innerHTML="woop";
    user.fetchInfos("test2");
    user.newWeightTemp("test2");
    user.checkEmail("mary@mary.com");
    user.checkEmail("bogusemail");

  });
});

class user{
  static async checkEmail(addr){
    fetch("/request",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({email: addr, type: "getAccount"}), // Gives the content and type of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    }).then(resp => resp.json().then(data => document.getElementById("garg").append(" | "+data)))
  }
  static async fetchInfos(tkn){
    fetch("/request",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn, type: "getInfos"}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp => resp.json().then(data => {
      const garg = document.getElementById("garg");
      data.forEach(el => {
        garg.append(" | "+el.bodytype+"/"+el.age+"/"+el.weight+"/"+el.height+"/"+el.updatedate)
      })
    }));
  }
  
  static async newWeightTemp(tkn){
    fetch("/request",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn, type: "getNewWeight"}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp => resp.json().then(data => document.getElementById("garg").append(" | "+data)));
  }
}

class utils{
  static convertUnit(){
    
  }
}