window.addEventListener("load", function(){
    const defaultHighlight={bgOff: "midgray", bgOn: "light", txtOff: "fadedtxt", txtOn: "dark"};

    bgAnim(); // Should never stop, animates the background
    formHightlight("sign-login", "login-btn", defaultHighlight, "login-field-email", "login-field-password"); // Highlights the submit button when the email & password fields are filled in the login form
    formHightlight("sign-register", "register-btn", defaultHighlight, "register-field-nickname", "register-field-email", "register-field-password"); // Highlights the submit button when the username, email & password fields are filled in the sign up form
    slideGrab("content-slider", "content-slider"); // Let us grab the day boxes

    popupHandler("settings","open-settings","exit-settings", 500, true) // Manages the opening & closing of our settings
    switchValue("settings-theme", "theme");
    switchValue("settings-unit", "unit");

    popupHandler("entry", "add-entry", "exit-entry", 500, true) // Manages the opening & closing of our new entry menu
    formHightlight("entry", "entry-submit-btn", defaultHighlight, "entry-form-primary-amount", "entry-form-secondary-amount");  // Highlights the submit button when the primary and secondary fields (gram&kcal || minutes&kcal/h) are filled in the new entry form
    setEntryType();  // Allows us to give a value to the element within our form handling the type of entry (act/cons)

    popupHandler("information", "settings-editinfo", "exit-information") // Manages the opening & closing of our information menu
    formHightlight("information-form", "information-submit-btn", defaultHighlight, "information-form-weight", "information-form-height", "information-form-age"); // Highlights the submit button when all the informations (weight, height & age) are filled in the information form (ON by default)

    popupHandler("warning","open-logout","exit-warning", 500, true, ()=>setWarning("<p>Are you sure <br>you want to logout from this account?</p>", 1, "YES")) // Manages opening & closing of warning logout menu
    popupHandler("warning","entry-menu","exit-warning", 500, true, ()=>setWarning("<p>AFAF?</p>", 0, "YES")) // Manages opening & closing of warning logout menu

    //
    const register = document.getElementById("register");
    register.addEventListener("click", function(){
        gotoFrom("sign-register", "sign-login", '75'); // Triggers when going to the sign up form from login page
    })

    //
    const login = document.getElementById("login");
    login.addEventListener("click", function(){
        gotoFrom("sign-login", "sign-register"); // Triggers when going back to the login form from the sign up page
    })
    

    // Triggers the login sequence if the user's "token" (held in their localStorage cache) is valid
    user.tokenLog().then(data => {
        if(data){
            loginSequence();
        }
    })

    // Triggers the login sequence if the user's inputted credentials are valid
    $('#login-form').submit(function(e) {
        e.preventDefault();
        user.login(e).then(data=>{
            if(data.status){
                loginSequence();
            } else {
                console.log("error pswd mail") // Will have to play with the form to show an error
            };
        })
    })

    // Triggers the register sequence if the credentials given to create the user's account do not conflict with pre-existing accounts'
    $('#register-form').submit(function(e) {
        e.preventDefault();
        user.register(e).then(data=>{
            if(data.status){
                registerSequence(e.target[0].value)
            } else {
                console.log("error mail") // Will have to play with the form to show an error
            };
        })
    })

    //
    $('#entry-form').submit(function(e) {
        e.preventDefault();
        console.log(e)
        //user.addEntry(e).then(data=>{
            //if(data.status){
            //    createEntryBoxes(data, date)
            //} else {
            //    console.log("error entry") // Will have to play with the form to show an error
            //};
        //})
        popOut(e.target.parentElement.parentElement, 500, true); // Target is the form, the form is held within a div which itself is held within a div (necessary to have the header), so we have to get the parent's parent to pop our menu in and out correctly
    })

    //
    $('#information-form').submit(function(e) {
        e.preventDefault();
        // DO THING
        popOut(e.target.parentElement.parentElement); // Target is the form, the form is held within a div which itself is held within a div (necessary to have the header), so we have to get the parent's parent to pop our menu in and out correctly
    })

    $('#warning-content').submit(function(e) {
        switch (e.target[0].warnType) {
            case 1:
                logoutSequence()
                break;
            default:
                alert("err warning")
                break;
        }
        return false;
    })

    
})

async function loginSequence(){
    gotoFrom("manager", "sign-login");

    const settings = await user.getSettings(); // Get USER's settings
    localStorage.setItem("unit", settings.unit);
    localStorage.setItem("theme", settings.theme);

    updateUserInfo();

    const entries = await user.getEntries()
    createDayBoxes(entries);
}

function registerSequence(name){
    gotoFrom("manager", "sign-register");

    const username = document.getElementById("user-name");
    username.innerHTML=name;

    localStorage.setItem("unit", 0);
    localStorage.setItem("theme", 0);

    //Will trigger an event to automatically pop up the Info menu (can't close)
}

function logoutSequence(){
    localStorage.removeItem("token");
    window.location.reload();
}

// Switches from our current interface(origin) to another interface(destination)
function gotoFrom(destination, origin, height=0, width=0){
    const start = document.getElementById(origin);
    const end = document.getElementById(destination);
    fadeToAnim(start, 0, end, height, width);
}

//
function bgAnim(){
    const bg = document.getElementById("background");
    let keyframe = {
        transform: [ "rotate(0deg)", "rotate(-20deg)", "rotate(0deg)", "rotate(20deg)", "rotate(50deg)", "rotate(70deg)", "rotate(100deg)", "rotate(120deg)", "rotate(140deg)", "rotate(170deg)", "rotate(200deg)", "rotate(230deg)", "rotate(260deg)", "rotate(290deg)", "rotate(310deg)", "rotate(340deg)", "rotate(360deg)"]
    };
    let option = {
        duration: 50000,
        iterations: Infinity
    };
    bg.animate(keyframe, option); 
}

// Fades an element(element)'s background color and makes it fade from its starting color(colorStart) to our desired color(colorEnd)
function colorBgFade(element, colorStart, colorEnd){
    let keyframe = {
        backgroundColor: [colorStart.value, colorEnd.value]
    };
    let option = {
        duration: 700,
        ease: "easing"
    };
    element.animate(keyframe, option);
}


// Takes a given element(element), alters its opacity to a new value(newOpacity) and then, if given as a parameter, fade in to a new element(nextElement) and adjust its width/height if desired.
function fadeToAnim(element, newOpacity, nextElement=0, adjustHeight=0, adjustWidth=0){
    let keyframe = {
        opacity: newOpacity,
    };
    let option = {
        duration: 700,
        ease: "easing"
    };
    let anim = element.animate(keyframe, option);
    anim.addEventListener('finish', () => {
        element.classList.add("hidden")
        if(nextElement!=0){
            nextElement.classList.remove("hidden");
            if(adjustHeight!=0){
                nextElement.style.height=adjustHeight+'%';
            }
            if(adjustWidth!=0){
                nextElement.style.width=adjustWidth+'%';
            }
            let nextAnim = nextElement.animate({opacity: [0,100]},option)
        }
    });
}


// Takes a page(page) to listen to and alters a button(btn)'s CSS based on whether the given fields(field1->field5) are filled or not.  
function formHightlight(page, btn, colors, field1, field2='', field3='', field4='', field5=''){
    
    let fields=[field1, field2, field3, field4, field5];
    let fieldTotal = 0;
    fields.forEach(fl => {
        if(fl!=''){
            fieldTotal++;
        }
    })
    const lgbtn = document.getElementById(btn);
    lgbtn['isActive']=0;
    const el = document.getElementById(page);
    el.addEventListener("keyup", function(){        
        const light = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.bgOn}`), name: colors.bgOn};
        const midgray = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.bgOff}`), name: colors.bgOff};
        
        const faded = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.txtOff}`), name: colors.txtOff};
        const dark = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.txtOn}`), name: colors.txtOn};

        let fieldValid = 0;
        fields.forEach(fl => {
            if(fl!=''){
                let fieldElement = document.getElementById(fl);
                if(fieldElement.value!=''){
                    fieldValid++
                }
            }
        })
        
        if(fieldValid==fieldTotal){
            if (lgbtn['isActive']!=1){
                // When all fields are filled do:
                if(getComputedStyle(lgbtn).backgroundColor!=light.value){
                    colorBgFade(lgbtn, midgray, light)
                }
                lgbtn.style.color=dark.value;
                lgbtn.style.backgroundColor=`var(--${light.name})`;
                lgbtn.classList.add('clickable')
            }
            lgbtn['isActive']=1;
        } else {
            if(lgbtn['isActive']===1){
                // When not enough fields are filled do: 
                colorBgFade(lgbtn, light, midgray)
                lgbtn.style.color=faded.value;
                lgbtn.style.backgroundColor=`var(--${midgray.name})`;
                lgbtn.classList.remove('clickable')
            }
            lgbtn['isActive']=0;
        }
    });
};

// Takes a text field(textID) and executes a given function(textGetFunc) when a specific type of event(eventTrigger) is triggered to edit the HTML contained within said text field.
function updateText(eventTrigger, textID, textGetFunc){
    const text = document.getElementById(textID);
    window.addEventListener(eventTrigger, function(){
        text.innerHTML=textGetFunc;
    })
};

function slideGrab(element, slides){
    const page = document.getElementById(element);
    const slider = document.getElementById(slides);
    let mouseDown = false;
    let startY, scrollTop;
   
    page.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if(!mouseDown) {
            return;
        }
        const y = e.pageY - slider.offsetTop;
        const scroll = y - startY;
        slider.scrollTop = scrollTop - scroll;
    });
   
    page.addEventListener("mousedown", function (e) {
        mouseDown = true;
        startY = e.pageY - slider.offsetTop;
        scrollTop = slider.offsetTop;
    }, false);

    page.addEventListener("mouseup", function () {
        mouseDown = false;
    }, false);
    page.addEventListener("mouseleave", function () {
        mouseDown = false;
    }, false);
}

async function updateUserInfo(){
    const username = await user.getName(); // Get USER's name

    let info = await user.getLastInfo(); // Get latest info of USER
    let units = {weight: "kg", height: "cm"}; // Sets default values for the units

    if (localStorage.getItem("unit")){ // 0=Metric, 1=Imperial. 1==True
        info.weight = utils.toLBS(info.weight); // Turns the collected info's weight from the default KG to LBS
        units.weight = "lbs"; // Switch from KG to LBS
        info.height = utils.toInch(info.height); // Turns the collection info's height from the default CM to INCHES
        units.height = '"'; // Switch from CM to INCHES (" symbol)
    }

    const name = document.getElementById("user-name");
    const weight = {amount: document.getElementById("user-weight-amount"), unit: document.getElementById("user-weight-unit")};
    const height = {amount: document.getElementById("user-height-amount"), unit: document.getElementById("user-height-unit")};

    weight.unit.innerHTML=units.weight; // Edits text to go from our page's weight unit value to our new weight unit value
    height.unit.innerHTML=units.height; // Same but for height
    
    weight.amount.innerHTML=utils.roundNum(info.weight); // Edits text to go from our page's weight value to our new weight value, and round it down to one decimal 
    height.amount.innerHTML=utils.roundNum(info.height); // Same but for height

    name.innerHTML=username; // Edits text to go from our page's default username to our actual username


    const editForm = {weight: document.getElementById("information-form-weight"), height: document.getElementById("information-form-height"), age: document.getElementById("information-form-age")};
    editForm.weight.value=utils.roundNum(info.weight);
    editForm.weight.nextElementSibling.children[0].innerHTML=units.weight;

    editForm.height.value=utils.roundNum(info.height);
    editForm.height.nextElementSibling.children[0].innerHTML=units.height;

    editForm.age.value=info.age;

}

function rolldownClick(clickedParent, targetChild, exceptChild=""){
    $(`.${clickedParent}`).click(function(e){ // Use JQuery to get when any single element with that class is clicked
        if(!e.originalEvent.target.classList.contains(exceptChild)){ // Checks if the exact div we clicked on has our "exceptChild" in its classes 
            const targetC = $(e.delegateTarget).find(`.${targetChild}`)[0] // Get the sole child with that targetted class found among our JQuery's click event's currentTarget's children
            let visibility = getComputedStyle(targetC).getPropertyValue('display')
            if(visibility!="none"){
                //When it's visible do:
                targetC.classList.add("hidden")
            } else {
                // When it's hidden do:
                targetC.classList.remove("hidden")
            };
        }
    });
}

function dayBoxClick(){
    $(`.manager-content-slider-box`).click(async function(e){ // Use JQuery to get when any single element with that class is clicked

        let modifier = e.currentTarget.classList.contains("bigbox-modifier");
        const slider = document.getElementById("content-slider")
        const bigbox = $(slider).find(`.bigbox-modifier`)
        if(!modifier){
            // When it's small do:
            bigbox[0].classList.remove("bigbox-modifier");
            bigbox[0].classList.add("smallbox-modifier")
            e.currentTarget.classList.remove("smallbox-modifier")
            e.currentTarget.classList.add("bigbox-modifier")
        };

        let boxDate = e.currentTarget.getElementsByClassName("getDate")[0].innerHTML;
        let newEntries = await getEntriesOn(boxDate);
        createEntryBoxes(newEntries, boxDate);
    });
}

async function createEntryBoxes(entries, date){    
    const settings = await user.getSettings(); // Get USER's settings
    const parent = document.getElementById("entry-menu");

    try{
        entries.cons.sort(function(a,b){
            return (b.timeof.hour*100+b.timeof.minute) - (a.timeof.hour*100+a.timeof.minute);
        });
        entries.acts.sort(function(a,b){
            return (b.timeof.hour*100+b.timeof.minute) - (a.timeof.hour*100+a.timeof.minute);
        });
    } catch(e){
        console.log("empty entries")
    };
    parent.replaceChildren();

    let maxDate = new Date(date)
    let infos = await user.getInfoFrom(maxDate);

    let goal=0;
    if(infos.bodytype==0){
        goal = utils.roundNum(447.593 + (9.247*infos.weight) + (3.098*infos.height) - (4.330*infos.age))
    } else {
        goal = utils.roundNum(88.362 + (13.397*infos.weight) + (4.799*infos.height) - (5.677*infos.age))
    }
    let intake=0;
    console.log(entries)
    entries.cons.forEach(cal =>{
        intake+=(cal.kcal*(cal.gram/100));
    });
    entries.acts.forEach(exe =>{
        intake-=((exe.duration/60)*exe.burnrate);
    });
    let newEl = document.createElement("div");
    newEl.classList.add("manager-content-info-box-goal");
    newEl.classList.add("f-idendidad");
    newEl.innerHTML = `<p><span id="day-intake">${intake}</span> / <span id="day-goal">${goal}</span>kcal</p>`;
    parent.appendChild(newEl);

    for(let i=0; i<Object.keys(entries).length; i++){
        Object.entries(entries)[i][1].forEach(el =>{
            el.primary={};
            el.secondary={};
            if(el.hasOwnProperty("kcal")){
                el.primary.unit="kcal";
                el.primary.amount=el.kcal;
                el.secondary.amount=el.gram;
                if(localStorage.getItem("unit")){
                    el.secondary.amount=utils.roundNum(utils.toLBS(el.secondary.amount)/1000, 2);
                    el.secondary.unit="lbs";
                } else {
                    el.secondary.unit="g";
                }
            } else {
                el.primary.unit="minute(s)";
                el.primary.amount=el.duration;
                el.secondary.unit="kcal/h";
                el.secondary.amount=el.burnrate;
            }

            if (`${el.timeof.hour}`.length==1){
                el.timeof.hour=`0${el.timeof.hour}`;
            }
            if (`${el.timeof.minute}`.length==1){
                el.timeof.minute=`0${el.timeof.minute}`;
            }

            let newEl = document.createElement("div");
            newEl.classList.add("manager-content-info-box-entry");
            console.log(el)
            newEl.innerHTML = `<div class="manager-content-info-box-entry-hour f-idendidad"><p><span class="entry-hour">${el.timeof.hour}</span>:<span class="entry-minute">${el.timeof.minute}</span></p></div><div class="manager-content-info-box-entry-content clickable"><div class="manager-content-info-box-entry-content-details f-idendidad"><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-primary-amount">${el.primary.amount}</span><span class="entry-primary-unit">${el.primary.unit}</span></p></div><div class="manager-content-info-box-entry-content-details-bar"></div><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-secondary-amount">${el.secondary.amount}</span><span class="entry-secondary-unit">${el.secondary.unit}</span></p></div></div><div class="manager-content-info-box-entry-content-main clickable hidden f-iconic" ><div class="manager-content-info-box-entry-content-main-bar"></div><div class="manager-content-info-box-entry-content-main-comment"><p>${el.comment}</p></div><div class="manager-content-info-box-entry-content-main-edit"><button class="manager-content-info-box-entry-content-main-edit-button f-iconic">EDIT ENTRY</button></div></div></div><div class="entry-data hidden">${el.entryid}</div>`;
            parent.appendChild(newEl);
        }
    )}
    rolldownClick("manager-content-info-box-entry-content", "manager-content-info-box-entry-content-main", "manager-content-info-box-entry-content-main-edit-button");
}


async function createDayBoxes(entries){
    const parent = document.getElementById("content-slider");
    try{
        entries.cons.sort(function(a,b){
            return new Date(b.timeof.year+"-"+b.timeof.month+"-"+b.timeof.day) - new Date(a.timeof.year+"-"+a.timeof.month+"-"+a.timeof.day);
        });
        entries.acts.sort(function(a,b){
            return new Date(b.timeof.year+"-"+b.timeof.month+"-"+b.timeof.day) - new Date(a.timeof.year+"-"+a.timeof.month+"-"+a.timeof.day);
        });
    } catch(e){
        console.log("empty days")
    }

    let elFirst=true;
    for(let i=0; i<Object.keys(entries).length; i++){
        let currentDay; let previousDay;
        Object.entries(entries)[i][1].forEach(async el =>{
            currentDay = el.timeof.year+"-"+el.timeof.month+"-"+el.timeof.day
            if(currentDay!=previousDay){
                let newEl = document.createElement("div");
                newEl.classList.add("manager-content-slider-box");
                newEl.classList.add("f-idendidad");
                newEl.classList.add("no-select");
                if(elFirst){
                    newEl.classList.add("bigbox-modifier");
                    elFirst=false;
                } else {
                    newEl.classList.add("smallbox-modifier");
                }
                newEl.innerHTML = `<div class="manager-content-slider-box-date"><p><span>${el.timeof.day}</span>/<span>${el.timeof.month}</span></p></div><div class="manager-content-slider-box-year"><p>${el.timeof.year}</p></div><div class="getDate hidden">${el.timeof.year}-${el.timeof.month}-${el.timeof.day}</div>`;
                parent.appendChild(newEl);
            }
            previousDay=currentDay;
        }
    )}
    const getDate = $(parent).find(".getDate")
    let newEntries = await getEntriesOn(getDate[0].innerHTML);
    createEntryBoxes(newEntries, getDate[0].innerHTML);
    dayBoxClick()
}


async function getEntriesOn(date) {
    let startDate = new Date(date);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate()+1);
    endDate.setMilliseconds(endDate.getMilliseconds()-1);
    startDate.setMinutes(startDate.getMinutes()-startDate.getTimezoneOffset())
    endDate.setMinutes(endDate.getMinutes()-endDate.getTimezoneOffset())
    let newEntries = await user.getEntriesFrom(startDate, endDate);
    return newEntries
}

function popOut(element, speed=500, bg=false){
    let keyframe = {
        opacity: [100,0],
    };
    let option = {
        duration: speed,
        ease: "easing"
    };
    let anim = element.animate(keyframe, option);
    anim.addEventListener('finish', () => {
        element.classList.add("hidden")
    });
    if(bg){
        let bgElement = document.getElementById("inactive-bg");
        let bganim = bgElement.animate(keyframe, option);
        bganim.addEventListener('finish', () => {
            bgElement.classList.add("hidden")
        });
    }
}

function popIn(element, speed=500, bg=false){
    element.classList.remove("hidden")
    element.scrollTop=0
    for(let i=0; i<element.children.length; i++){
        element.children[i].scrollTop=0;
    }
    let keyframe = {
        opacity: [0,100],
    };
    let option = {
        duration: speed,
        ease: "easing"
    };
    element.animate(keyframe, option);
    if(bg){
        const bg = document.getElementById("inactive-bg");
        bg.classList.remove("hidden");
        bg.animate(keyframe, option);
    }
}

function popupHandler(element, entryBtn, exitBtn, speed=500, bg=false, extraFunc=()=>{console.log("default2")}){
    const el = document.getElementById(element);
    const entrance = document.getElementById(entryBtn);
    const exit = document.getElementById(exitBtn);


    if(entryBtn!=exitBtn){
        entrance.addEventListener("click", ()=> {
            if(el.classList.contains("hidden")){
                extraFunc();
                popIn(el, speed, bg);
            }
        })
        exit.addEventListener("click", ()=> {
            if(!el.classList.contains("hidden")){
                popOut(el, speed, bg);
            }
        })
    } else {
        entrance.addEventListener("click", ()=> {
            if(el.classList.contains("hidden")){
                extraFunc();
                popIn(el, speed, bg);
            } else {
                popOut(el, speed, bg);
            }
        })
    }
}

function setEntryType(){
    const btn = document.getElementById("entry-form-type");
    btn["entryType"]=0; // set as a cons. by default
    btn.addEventListener("click", (e) =>{
        if (e.target["entryType"]==0){
            e.target["entryType"]=1; // 1: Act.
            e.target.value="EXERCISE MODE";
            e.target.form[1].previousElementSibling.innerText="Minutes";
            e.target.form[2].previousElementSibling.innerText="Kcal/h";
        } else {
            e.target["entryType"]=0; // 0: Cons.
            e.target.value="INTAKE MODE";
            e.target.form[1].previousElementSibling.innerText="Gram";
            e.target.form[2].previousElementSibling.innerText="Kcal";
        }
    })
}

async function switchValue(btn, item, valueOn=1, valueOff=0, effectFunc=()=>{console.log("default1")}){
    const element = document.getElementById(btn);
    element.addEventListener("click", ()=>{
        if(localStorage.getItem(item)==valueOn){
            localStorage.setItem(item, valueOff);
            effectFunc();
        } else {
            localStorage.setItem(item, valueOn);
            effectFunc();
        }
    })
}

function setWarning(txtMsg, warnType=0, txtBtn="YES"){
    const warnMsg = document.getElementById("warning-message")
    const warnBtn = document.getElementById("warning-btn")
    warnMsg.innerHTML=txtMsg;
    warnBtn.children[0].innerHTML=txtBtn;
    warnBtn["warnType"]=warnType;
}