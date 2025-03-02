window.addEventListener("load", function(){
  var element = document.getElementById("garg"); 
  element.addEventListener("click", function(){
    user.newWeightTemp("test2")
  });
});

class user{
  static async checkEmail(addr){
    await fetch("/request",{ // Fetch request at the "[website]/request" URL
      method: "POST",
      body: JSON.stringify({email: addr, type: "getAccount"}), // Gives the content and type of request for the controller to sort the requests.
      headers: {"Content-Type": "application/json"} // Tells the type of content we're sending to our URL
    }).then(resp =>resp.json().then(data => document.getElementById("garg").innerHTML=data)) ; 
  }
  static async fetchInfos(tkn){
    await fetch("/request",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn, type: "getInfos"}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp =>resp.json().then(data => { data.forEach(el => {document.getElementById("garg").innerHTML=el.bodytype+"/"+el.age+"/"+el.weight+"/"+el.height+"/"+el.updatedate})})); // Rn it's basically invisible, but it does fetch and displays both entries. This will be implemented with a .appendChild(), so won't overwrite like here.
  }
  static async newWeightTemp(tkn){
    await fetch("/request",{ // same as above
      method: "POST",
      body: JSON.stringify({token: tkn, type: "getNewWeight"}), // Same as above
      headers: {"Content-Type": "application/json"} // Same as above
    }).then(resp =>resp.json().then(data => {document.getElementById("garg").innerHTML=data}));
  }
}