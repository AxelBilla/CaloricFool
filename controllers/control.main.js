export async function main(req){
    const types = new Map(); // Creates a map with our functions & control file's path

    //types.set("getUser", {func: "getUser", path: import("./control.get.js")});
    types.set("getInfos", {func: "getInfos", path: import("./control.get.js")});
    //types.set("getEntries", {func: "getEntries", path: import("./control.get.js")});
    //types.set("getToken", {func: "getToken", path: import("./control.get.js")});
    //types.set("getTokenValid", {func: "getTokenValid", path: import("./control.get.js")});
    types.set("getAccount", {func: "getAccount", path: import("./control.get.js")});
    types.set("getNewWeight", {func: "getNewWeight", path: import("./control.get.js")});

    //types.set("addUser", {func: "addUser", path: import("./control.add.js")});
    //types.set("addInfos", {func: "addInfos", path: import("./control.add.js")});
    //types.set("addToken", {func: "addToken", path: import("./control.add.js")});
    //types.set("addConso", {func: "addConso", path: import("./control.add.js")});
    //types.set("addAct", {func: "addAct", path: import("./control.add.js")});

    //types.set("set", {func: "set", path: import("./control.set.js")});
    //...

    if(types.has(req.type)){ // Checks if requested type exists
        const con = await types.get(req.type)["path"]; // Imports the functions from the file path given by our request's type
        return con[types.get(req.type)["func"]](req); // Returns the values obtained from executing the function of our requested type
    }else{
        console.log("Type not found.");
    };
}