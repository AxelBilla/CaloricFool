window.addEventListener("load", function(){
    const defaultHighlight={bgOff: "midgray", bgOn: "light", txtOff: "fadedtxt", txtOn: "dark"};

    bgAnim(); // Should never stop, animates the background

    formHightlight("sign-login", "login-btn", defaultHighlight, "login-field-email", "login-field-password"); // Highlights the submit button when the email & password fields are filled in the login form
    formHightlight("sign-register", "register-btn", defaultHighlight, "register-field-nickname", "register-field-email", "register-field-password"); // Highlights the submit button when the username, email & password fields are filled in the sign up form
    
    slideGrab("content-slider"); // Let us grab the day boxes
    exitPopup(); // Let's you exit popups up with the [Escape] key

    popupHandler("entry", "add-entry", "exit-entry", 500, true) // Manages the opening & closing of our new entry menu
    formHightlight("entry", "entry-submit-btn", defaultHighlight, "entry-form-primary-amount", "entry-form-secondary-amount");  // Highlights the submit button when the primary and secondary fields (gram&kcal || minutes&kcal/h) are filled in the new entry form
    setEntryType();  // Allows us to give a value to the element within our form handling the type of entry (act/cons)

    openElement("manager-content-info-box-entry-content", "manager-content-info-box-entry-content-main", "manager-content-info-box-entry-content-main-edit-button");

    formHightlight("information-form", "information-submit-btn", defaultHighlight, "information-form-weight", "information-form-height", "information-form-age"); // Highlights the submit button when all the informations (weight, height & age) are filled in the information form (ON by default)
    popupHandler("information", "settings-editinfo", "exit-information", 500, false, ()=>{
        document.getElementById("information").children[0].children[1].classList.remove("hidden");
        triggerEvent(document.getElementById("information-form"), "input")
    }) // Manages the opening & closing of our information menu

    switchElementValue("information-form-bodytype", "bodyType", 1, 0, 
        ()=>{
            let userType=document.getElementById("information-form-bodytype"); 
            switchElement(userType.children[0], userType.children[1], userType["bodyType"], 1);
        });


    popupHandler("settings","open-settings","exit-settings", 500, true) // Manages the opening & closing of our settings
    switchCacheValue("settings-theme", "theme");
    switchCacheValue("settings-unit", "unit");
    
    popupHandler("warning","open-logout","exit-warning", 500, true, ()=>setWarning("<p>Are you sure <br>you want to logout from this account?</p>", 1, "YES")) // Manages opening & closing of warning logout menu
    
    
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
        let date;
        if(e.target[4].value===""){
            date = new Date();
        } else {
            date = new Date(e.target[4].value+" "+e.target[5].value);
        }
        date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        console.log(e, date)
        user.addEntry(e, date).then(data=>{
            if(data.status){
                const slider = document.getElementById("content-slider"); 
                let day = createDay(data.entry);
                if(slider.children.length>0){
                    let dayDate = new Date(`${data.entry.timeof.year}-${data.entry.timeof.month}-${data.entry.timeof.day}`);
                    var targetDay=slider.children[0];
                    let targetCheck=0;
                    for(let i = 0; i<slider.children.length; i++){
                        let newDate = new Date(slider.children[i].lastElementChild.innerHTML);
                        if(newDate.getTime()>=dayDate.getTime()){
                            if(newDate.getTime()===dayDate.getTime()){
                                targetCheck=1;
                                break;
                            } else {
                                targetDay=slider.children[i];
                                targetCheck=2;
                            }
                        }
                    }
                    if(targetCheck!==1){
                        if(targetCheck!==0){
                            targetDay.parentNode.insertBefore(day, targetDay.nextSibling);
                        } else {
                            targetDay.parentNode.insertBefore(day, targetDay);
                        }
                    }
                    const bigbox = $(slider).find(`.bigbox-modifier`)[0]
                    if(bigbox.lastElementChild.innerHTML==data.entry.timeof.year+"-"+data.entry.timeof.month+"-"+data.entry.timeof.day){
                        let entries = document.getElementById("entry-menu");
                        let entryDate = new Date(`2024-04-04 ${data.entry.timeof.hour}:${data.entry.timeof.minute}`)
                        let goal = entries.children[0];
                        for(let i = 1; i<entries.children.length; i++){
                            let newDate = new Date(`2024-04-04 ${entries.children[i].children[0].children[0].children[0].textContent}:${entries.children[i].children[0].children[0].children[1].textContent}`)
                            if(newDate.getTime()>=entryDate.getTime()){
                                goal=entries.children[i];
                            }
                        }
                        let newEntry = createEntry(data.entry);
                        goal.parentNode.insertBefore(newEntry, goal.nextSibling);
                    }
                } else {
                    day.classList.add("bigbox-modifier");
                    day.classList.remove("smallbox-modifier")
                    slider.appendChild(day)
                    triggerEvent(day, "click");
                }
                dayBoxClick();
                popOut(e.target.parentElement.parentElement, 500, true); // Target is the form, the form is held within a div which itself is held within a div (necessary to have the header), so we have to get the parent's parent to pop our menu in and out correctly
            } else {
                console.log("error entry"); // Will have to play with the form to show an error
            };
        })
    })

    //
    $('#information-form').submit(function(e) {
        e.preventDefault();
        if(localStorage.getItem("unit")==="1"){
            e.target[0].value=utils.roundNum(utils.toKG(e.target[0].value), 3);
            e.target[1].value=utils.roundNum(utils.toCM(e.target[1].value), 3);
        };
        e.target[3].bodyType ??= 0; // Yes, I learned about those operators. Yes, I fucking hate how there's built-in operators for undefined/null.
        
        date = new Date();
        date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        
        user.addInfo(e, date).then(data => {
            if(data.status){
                updateUserInfo();
                if(e.target["isRegistering"]===1){
                    e.target["isRegistering"]=0;
                    popOut(e.target.parentElement.parentElement, 500, true);
                } else {
                    popOut(e.target.parentElement.parentElement);
                }
            } else {
                console.log("error info"); // Will have to play with the form to show an error
            }
        })
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
    createDayBoxes();
}

function registerSequence(name){
    gotoFrom("manager", "sign-register");

    const username = document.getElementById("user-name");
    username.innerHTML=name;

    localStorage.setItem("unit", 0);
    localStorage.setItem("theme", 0);

    const infoMenu = document.getElementById("information")
    infoMenu.children[0].children[1].classList.add("hidden");
    infoMenu.children[1].children[0]["isRegistering"]=1;
    if(infoMenu.children[1].children[0][0].value!==""){
        infoMenu.children[1].children[0][0].value="";
        infoMenu.children[1].children[0][1].value="";
        infoMenu.children[1].children[0][2].value="";
    }

    popIn(infoMenu, 500, true)

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
function formHightlight(page, btn, colors, ...fields){
    
    let fieldTotal = fields.length;
    const lgbtn = document.getElementById(btn);
    if(lgbtn['isActive']!==1){
        lgbtn['isActive']=0;
    }
    const el = document.getElementById(page);
    
    el.addEventListener("input", ()=>{        
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

function slideGrab(slides){
    const slider = document.getElementById(slides);

    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    startY = e.pageY - slider.offsetTop;
    scrollLeft = slider.scrollLeft;
    scrollTop = slider.scrollTop;
    slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - startX) * 1; // Change this number to adjust the scroll speed
    const walkY = (y - startY) * 1; // Change this number to adjust the scroll speed
    slider.scrollLeft = scrollLeft - walkX;
    slider.scrollTop = scrollTop - walkY;
    });
}

async function updateUserInfo(){
    const username = await user.getName(); // Get USER's name

    let info = await user.getLastInfo(); // Get latest info of USER
    let units = {weight: "kg", height: "cm"}; // Sets default values for the units

    if(localStorage.getItem("unit")==="1"){ // 0=Metric, 1=Imperial. 1==True
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


    const editForm = {weight: document.getElementById("information-form-weight"), height: document.getElementById("information-form-height"), age: document.getElementById("information-form-age"), bodytype: document.getElementById("information-form-bodytype"), submit: document.getElementById("information-submit-btn")};
    editForm.weight.value=utils.roundNum(info.weight);
    editForm.weight.nextElementSibling.children[0].innerHTML=units.weight;

    editForm.height.value=utils.roundNum(info.height);
    editForm.height.nextElementSibling.children[0].innerHTML=units.height;

    editForm.age.value=info.age;

    editForm.bodytype["bodyType"]=info.bodytype;
    switchElement(editForm.bodytype.children[0], editForm.bodytype.children[1], editForm.bodytype["bodyType"], 1);
}

function openElement(clickedParent, targetChild, exceptChild=""){
    $(document).on("click", `.${clickedParent}`,function(e){ // Use JQuery to get when any single element with that class is clicked
        let childID;
        for(let i = 0; i<e.currentTarget.children.length; i++){
            if(e.currentTarget.children[i].classList.contains(targetChild)){
                childID=i;
                break;
            }
        };

        if(!e.target.classList.contains(exceptChild)){ // Checks if the exact div we clicked on has our "exceptChild" in its classes 
            if(!e.currentTarget.children[childID].classList.contains("hidden")){
                //When it's visible do:
                e.currentTarget.children[childID].classList.add("hidden")
            } else {
                // When it's hidden do:
                e.currentTarget.children[childID].classList.remove("hidden")
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
    const parent = document.getElementById("entry-menu");
    parent.replaceChildren();

    if(!date instanceof Date){
        date = new Date(date)
    }
    let infos = await user.getInfoFrom(date);

    let goal=0;
    if(infos.bodytype==0){
        goal = (447.593 + (9.247*infos.weight) + (3.098*infos.height) - (4.330*infos.age))*1.2
    } else {
        goal = (88.362 + (13.397*infos.weight) + (4.799*infos.height) - (5.677*infos.age))*1.2
    }

    let intake=0;
    entries.cons.forEach(cal =>{
        intake+=(cal.kcal*(cal.gram/100));
    });
    entries.acts.forEach(exer =>{
        intake-=((exer.duration/60)*exer.burnrate);
    });

    let newEl = document.createElement("div");
    newEl.id="tracker-goal";
    newEl.classList.add("manager-content-info-box-goal");
    newEl.classList.add("f-idendidad");
    newEl.innerHTML = `<p><span id="day-intake">${utils.roundNum(intake)}</span>&nbsp/&nbsp<span id="day-goal">${utils.roundNum(goal)}</span>&nbspkcal</p>`;
    if(parent.hasChildNodes()){
        parent.replaceChildren(newEl)
    } else {
        parent.appendChild(newEl);
    }

    entries = entries.cons.concat(entries.acts);
    try{
        entries.sort(function(a,b){
            return (b.timeof.hour*100+b.timeof.minute) - (a.timeof.hour*100+a.timeof.minute);
        });
    } catch(e){
        console.log("empty entries")
    };
    for(let i=0; i<entries.length; i++){
        parent.appendChild(createEntry(entries[i]));
    }
}

function createEntry(el){
    el.primary={};
    el.secondary={};
    if(el.hasOwnProperty("kcal")){
        el.primary.unit=" kcal";
        el.primary.amount=el.kcal;
        el.secondary.amount=el.gram;
        if(localStorage.getItem("unit")==="1"){
            el.secondary.amount=utils.roundNum(utils.toLBS(el.secondary.amount)/1000, 2);
            el.secondary.unit=" lbs";
        } else {
            el.secondary.unit=" g";
        }
    } else {
        el.primary.unit=" minute(s)";
        el.primary.amount=el.duration;
        el.secondary.unit=" kcal/h";
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
    newEl.innerHTML = `<div class="manager-content-info-box-entry-hour f-idendidad"><p><span class="entry-hour">${el.timeof.hour}</span>:<span class="entry-minute">${el.timeof.minute}</span></p></div><div class="manager-content-info-box-entry-content clickable"><div class="manager-content-info-box-entry-content-details f-idendidad"><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-primary-amount">${el.primary.amount}</span><span class="entry-primary-unit">${el.primary.unit}</span></p></div><div class="manager-content-info-box-entry-content-details-bar"></div><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-secondary-amount">${el.secondary.amount}</span><span class="entry-secondary-unit">${el.secondary.unit}</span></p></div></div><div class="manager-content-info-box-entry-content-main clickable hidden f-idendidad" ><div class="manager-content-info-box-entry-content-main-bar"></div><div class="manager-content-info-box-entry-content-main-comment"><p>${el.comment}</p></div><div class="manager-content-info-box-entry-content-main-edit"><button class="manager-content-info-box-entry-content-main-edit-button f-iconic">EDIT ENTRY</button></div></div></div><div class="entry-data hidden">${el.entryid}</div>`;
    return newEl;
}

async function createDayBoxes(){
    const parent = document.getElementById("content-slider");
    let entries = await user.getEntries()
    parent.replaceChildren();

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

    let elFirst = true;
    for(let i=0; i<Object.keys(entries).length; i++){
        let currentDay; let previousDay;
        Object.entries(entries)[i][1].forEach(async el =>{
            currentDay = el.timeof.year+"-"+el.timeof.month+"-"+el.timeof.day
            if(currentDay!=previousDay){
                let newEl = createDay(el);
                if(elFirst){
                    newEl.classList.add("bigbox-modifier");
                    newEl.classList.remove("smallbox-modifier")
                    elFirst=false;
                }
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

function popOut(element, speed=500, bg=false, extraFunc=()=>{return;}){
    if(sessionStorage.getItem("currentPopup")==="information"){
        sessionStorage.setItem("currentPopup", "settings")
    } else {
        sessionStorage.setItem("currentPopup", "")
    }
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
    extraFunc();
}

function popIn(element, speed=500, bg=false, extraFunc=()=>{return;}){
    if(element.id!==""){
        sessionStorage.setItem("currentPopup", element.id)
    }
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
    extraFunc();
}

function popupHandler(element, entryBtn, exitBtn, speed=500, bg=false, extraFunc=()=>{return;}){
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

function switchCacheValue(btn, item, valueOn=1, valueOff=0, effectFunc=()=>{return;}){
    const element = document.getElementById(btn);
    element.addEventListener("click", ()=>{
        if(localStorage.getItem(item)===valueOn){
            localStorage.setItem(item, valueOff);
            effectFunc();
        } else {
            localStorage.setItem(item, valueOn);
            effectFunc();
        }
    })
}

function switchElementValue(btn, item, valueOn=1, valueOff=0, effectFunc=()=>{return;}){
    const element = document.getElementById(btn);
    element.addEventListener("click", ()=>{
        if(element[item]==valueOn){
            element[item]= valueOff;
            effectFunc();
        } else {
            element[item]= valueOn;
            effectFunc();
        }
    })
}

function switchElement(firstEl, secondEl, anchorData, dataOn){
    if (anchorData!==dataOn){
        secondEl.classList.add("hidden")
        popIn(firstEl)
    } else {
        firstEl.classList.add("hidden")
        popIn(secondEl)
    }
}

function setWarning(txtMsg, warnType=0, txtBtn="YES"){
    const warnMsg = document.getElementById("warning-message")
    const warnBtn = document.getElementById("warning-btn")
    warnMsg.innerHTML=txtMsg;
    warnBtn.children[0].innerHTML=txtBtn;
    warnBtn["warnType"]=warnType;
}

function triggerEvent(target, event){
    let newEvent = new Event(event);
    target.dispatchEvent(newEvent);
}

function createDay(el){
    let newEl = document.createElement("div");
    newEl.classList.add("manager-content-slider-box");
    newEl.classList.add("f-idendidad");
    newEl.classList.add("no-select");
    newEl.classList.add("smallbox-modifier");
    newEl.innerHTML = `<div class="manager-content-slider-box-date"><p><span>${el.timeof.day}</span>/<span>${el.timeof.month}</span></p></div><div class="manager-content-slider-box-year"><p>${el.timeof.year}</p></div><div class="getDate hidden">${el.timeof.year}-${el.timeof.month}-${el.timeof.day}</div>`;
    return newEl;
}

function exitPopup(){
    window.addEventListener("keydown", (e)=>{
        if(e.key==="Escape"){
            let popup = sessionStorage.getItem("currentPopup");
            if(popup!==""){
                if(popup!=="information"){
                    popOut(document.getElementById(popup), 500, true)
                } else {
                    popOut(document.getElementById(popup)) // Since information is the only popup without a bg
                }
            }
        }
    })
}