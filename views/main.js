const defaultHighlight={bgOff: "midgray", bgOn: "light", txtOff: "fadedtxt", txtOn: "txton"};

window.addEventListener("load", function(){
    updateTheme(); // Updates theme on load

    bgAnim(); // Should never stop, animates the background

    formHightlight("sign-login", "login-btn", defaultHighlight, "login-field-email", "login-field-password"); // Highlights the submit button when the email & password fields are filled in the login form
    formHightlight("sign-register", "register-btn", defaultHighlight, "register-field-nickname", "register-field-email", "register-field-password"); // Highlights the submit button when the username, email & password fields are filled in the sign up form
    
    slideGrab("content-slider"); // Let us grab the day boxes
    exitPopup(); // Let's you exit popups up with the [Escape] key

    popupHandler("entry", "add-entry", "exit-entry", 500, true); // Manages the opening & closing of our new entry menu
    formHightlight("entry", "entry-submit-btn", defaultHighlight, "entry-form-primary-amount", "entry-form-secondary-amount");  // Highlights the submit button when the primary and secondary fields (gram&kcal || minutes&kcal/h) are filled in the new entry form
    setEntryType();  // Allows us to give a value to the element within our form handling the type of entry (act/cons)

    openElement("manager-content-info-box-entry-content", "manager-content-info-box-entry-content-main", "manager-content-info-box-entry-content-main-edit-button"); // Close & Open individual entries, while also avoiding to do so if you click on the edit button (otherwise it'll close whenever you want to make an edit which can be annoying as hell)

    formHightlight("information-form", "information-submit-btn", defaultHighlight, "information-form-weight", "information-form-height", "information-form-age"); // Highlights the submit button when all the informations (weight, height & age) are filled in the information form (ON by default)
    popupHandler("information", "settings-editinfo", "exit-information", 500, false, ()=>{
        document.getElementById("information").children[0].children[1].classList.remove("hidden"); // We hide the exit button on registry, so to be 100% sure there's no issue we make sure it's always removed when opening that menu
        triggerEvent(document.getElementById("information-form"), "input"); // The only time it's not filled in are at registry (no information stored yet) and when a user clears a field manually, so we're automatically triggering the event that's being listened to so our field checking function parse throughs the field and highlight the button (since the fields should naturally be filled in)
    }); // Manages the opening & closing of our information menu

    switchElementAttribute("information-form-bodytype", "bodyType", 1, 0, // switch <information-form-bodytype>'s "bodyType" attribute value so we can know use it once the information form is submitted
        ()=>{
            let userType=document.getElementById("information-form-bodytype"); 
            switchElement(userType.children[0], userType.children[1], userType.getAttribute("bodyType"), 1); // Clicking on that button has to both trigger the value swap AND change the image we're displaying at the same time, so I just use the option function parameter from my switchElementAttribute function to get everything working properly
        }); 


    popupHandler("settings","open-settings","exit-settings", 500, true); // Manages the opening & closing of our settings
    switchCacheValue("settings-theme", "theme", 1, 0, ()=>{ // Same thing as switchElementAttribute, except with data that we may want to persist on reload. (not really necessary for any of our settings since we already update them on every login (token or not))
        requests.editSettings(); updateTheme(); // Sends out the edit requests & updates the page to reflect our current setting
        let theme = document.getElementById("settings-theme");
        let content = localStorage.getItem("theme");
        if(content==1){
            switchElement(theme.children[0], theme.children[1], content, content); // Similar kind of element as for our bodytype button, so similar requirements
        } else {
            switchElement(theme.children[1], theme.children[0], content, content);
        }});
        
    switchCacheValue("settings-unit", "unit", 1, 0, ()=>{ // Same thing as for themes
        requests.editSettings(); updateUnit();
        let unit = document.getElementById("settings-unit");
        let content = localStorage.getItem("unit");
        if(content==1){
            switchElement(unit.children[0], unit.children[1], content, content);
        } else {
            switchElement(unit.children[1], unit.children[0], content, content);
        }
        });
    
    
    popupHandler("warning","open-logout","exit-warning", 500, true, ()=>{setWarning("Are you sure\nyou want to logout from this account?", "YES", logoutSequence)}); // Manages opening & closing of warning logout menu.
    
    
    // Triggers when going to the sign up form from login page
    const register = document.getElementById("register");
    register.addEventListener("click", function(){
        gotoFrom("sign-register", "sign-login", '75');
    })

    // Triggers when going back to the login form from the sign up page
    const login = document.getElementById("login");
    login.addEventListener("click", function(){
        gotoFrom("sign-login", "sign-register");
    })
    

    // Triggers the login sequence if the user's "token" (held in localStorage) is valid
    requests.tokenLog().then(data => {
        if(data.status){
            loginSequence();
        }
    })

    // Triggers the login sequence if the user's inputted credentials are valid
    document.getElementById("login-form").addEventListener("submit", (e)=>{
        e.preventDefault();
        requests.login(e).then(data=>{
            if(data.status){
                loginSequence();
            } else {
                setWarning("Invalid Credentials,\nplease try\nagain.", "RETRY");
                popIn(document.getElementById("warning"), 500, true);
            };
        })
    })

    // Triggers the register sequence if the credentials given to create the user's account do not conflict with pre-existing accounts'
    document.getElementById("register-form").addEventListener("submit", (e)=>{
        e.preventDefault();
        requests.register(e).then(data=>{
            if(data.status){
                registerSequence(e.target[0].value);
            } else {
                setWarning("Email is invalid,\n or an account\nis already\n registered with\nthis email.", "RETRY");
                popIn(document.getElementById("warning"), 500, true);
            };
        })
    })

    // Triggers when submitting a new entry
    document.getElementById("entry-form").addEventListener("submit", (e)=>{
        e.preventDefault();
        let date;
        if(e.target[4].value===""){ // Putting a date is optional, but we NEED a date. So.....
            date = new Date(); // If there's no day, we can just use a default date (which creates a date object with the time and date at the time it's instantiated)
        } else {
            date = new Date(e.target[4].value+" "+e.target[5].value); // However, if there IS a day, we take the day and time inputted and use them to create our date (i.e, it'll often be smth like <"01/01/2011"+" "+"18:23">, which create a proper <01/01/2011 18:23> date that the date class can use. But, since you might not have an hour, doing the same will get you a <01/01/2011 00:00> date (since we can create an instance of date with just the "dd/mm/yyyy" format, at the price of a default hour at midnight))
        }
        date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds(); // However, because of timezone-related issues + the possible date defaulting, we have to descontruct our date into a usable string so it can be send to and used by our DB.
        requests.addEntry(e, date).then(data=>{
            if(data.status){ // data.status can only be <true> (everything went well, request successful) OR <false> (something went wrong, request aborted)
                const slider = document.getElementById("content-slider"); // Get the parent of all our day boxes
                let day = createDay(data.entry); // Create a day box for our new entry (necessary when the entry is on a day that doesn't exist yet (i.e, in the future or even prior to using the app))
                if(slider.children.length>0){ // Checks if the user has any day boxes already displayed
                    let dayDate = new Date(`${data.entry.timeof.year}-${data.entry.timeof.month}-${data.entry.timeof.day}`); // Construct a date object so we can compare their epoch time (and since we only have a date, it'll tell us if a date comes before another or not) 
                    var targetDay=slider.children[0]; // Since everything's ordered by date, and we know our slider has at least 1 child, the child at index 0 will ALWAYS exist and ALWAYS be at the top
                    let targetCheck=0; // Used to know whether our entry's date is the most recent (=0), already exists (=1) or comes after this date (=2)
                    for(let i = 0; i<slider.children.length; i++){
                        let newDate = new Date(slider.children[i].getAttribute("getDate"));
                        if(newDate.getTime()>=dayDate.getTime()){ 
                            if(newDate.getTime()===dayDate.getTime()){
                                targetCheck=1; // == Our date already exists, we can end our loop
                                break;
                            } else {
                                targetDay=slider.children[i]; // == This date is more recent than ours, we assign this date to targetDay 
                                targetCheck=2;
                            }
                        }
                    }
                    if(targetCheck!==1){ // Checks if our date doesn't already exist
                        if(targetCheck!==0){ // Checks if our date isn't the most recent one
                            targetDay.parentNode.insertBefore(day, targetDay.nextSibling); // Inserts our date's day below the most recent date we found, which is before the one that's right below it (basically, if our date is [10/10/2010] it'll be smth like '[12/10/2010] - {INSERTED HERE} - [8/10/2010]', where [12/10/2010] is our most recent one & [8/10/2010] is the one that used to be right below it)
                        } else {
                            targetDay.parentNode.insertBefore(day, targetDay); // Inserts out date's day before (above) everything
                        }
                    }
                    const bigbox = slider.getElementsByClassName("bigbox-modifier")[0]; // Gets us every element with the "bigbox-modifier" class, who can't EVER be given to more than two elements.
                    if(sessionStorage.getItem("currentBox")==data.entry.timeof.year+"-"+data.entry.timeof.month+"-"+data.entry.timeof.day){ // Checks if our entry date's corresponds to the currently opened date box
                        let entries = document.getElementById("entry-menu");
                        let entryDate = new Date(`2024-04-04 ${data.entry.timeof.hour}:${data.entry.timeof.minute}`) // Uses a bogus date so we can compare the hours
                        let targetGoal = entries.children[0]; // our intake/goal tracker is always the first(0) element drawn in our entry menu 
                        for(let i = 1; i<entries.children.length; i++){
                            let newDate = new Date(`2024-04-04 ${entries.children[i].children[0].children[0].children[0].textContent}:${entries.children[i].children[0].children[0].children[1].textContent}`);
                            if(newDate.getTime()>=entryDate.getTime()){
                                targetGoal=entries.children[i]; // Same kinda trick as for our day boxes, except for entries.
                            }
                        }
                        let newEntry = createEntry(data.entry); // Creates the entry proper
                        targetGoal.parentNode.insertBefore(newEntry, targetGoal.nextSibling); // A day can't exist without an entry, so we know that there'll always be something below our intake/goal tracker.
                        editEntry(); // Re-applies editEntry's event to account for the newly created entry
                    }
                    dayBoxClick(); // Re-applies dayBoxClick's event to account for the newly created day box 
                } else { // Reminder, this happens when we don't have any day boxes at all (i.e, new account)
                    day.classList.add("bigbox-modifier"); // Gives it the bigbox look
                    day.classList.remove("smallbox-modifier"); // Gotta remove the default "smallbox-modifier"
                    slider.appendChild(day); // Slider doesn't have any children, so we can just append it for it to become children #1 (0)
                    dayBoxClick(); // Re-applies dayBoxClick's event to account for the newly created day box 
                    triggerEvent(slider.children[0], "click"); // Manually triggers the clicking event so it opens
                }
                popOut(e.target.parentElement.parentElement, 500, true); // Target is the form, the form is held within a div which itself is held within a div (necessary to have the header), so we have to get the parent's parent to pop our menu in and out correctly
                updateTracker();
            } else {
                setWarning("An error has occured,\nplease try again.", "RETRY");
                popIn(document.getElementById("warning"), 500, true);
            };
        })
    })

    // Triggers when submitting new informations
    document.getElementById("information-form").addEventListener("submit", (e)=>{
        e.preventDefault();
        if(localStorage.getItem("unit")==="1"){ // Checks if we're on Imperial or Metric
            e.target[0].value=utils.roundNum(utils.toKG(e.target[0].value), 3); // Converts from Imperial to Metric cuz we store everything in Metric on the backend
            e.target[1].value=utils.roundNum(utils.toCM(e.target[1].value), 3);
        };
        if(e.target[3].getAttribute("bodyType")!=1){
            e.target[3].setAttribute("bodyType", 0); // Can only be 0 or 1, so we default to 0 if it's anything different from 1
        }
        
        date = new Date();
        date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        
        requests.addInfo(e, date).then(data => {
            if(data.status){
                updateUser(); // Update user infos page-wide
                if(e.target.getAttribute("isRegistering")==1){ // Checks if it's the first use (when registering)
                    e.target.setAttribute("isRegistering", 0);
                    popOut(e.target.parentElement.parentElement, 500, true);
                } else {
                    popOut(e.target.parentElement.parentElement);
                }
            } else {
                setWarning("An error has occured,\nplease try again.", "RETRY");
                popIn(document.getElementById("warning"), 500, true);
            }
        })
    })
})




async function loginSequence(){
    gotoFrom("manager", "sign-login");

    const settings = await requests.getSettings(); // Get USER's settings
    localStorage.setItem("unit", settings.unit);
    localStorage.setItem("theme", settings.theme);

    updateUser();
    createDayBoxes(); // Create the day slider's boxes & everything related to them (entries)
}

function registerSequence(name){
    gotoFrom("manager", "sign-register");

    const username = document.getElementById("user-name");
    username.innerHTML=name; // Edits the user's overview box to have the correct nickname

    localStorage.setItem("unit", 0); // Settings all at 0 by default
    localStorage.setItem("theme", 0);

    const infoMenu = document.getElementById("information");
    infoMenu.querySelector("#exit-header-information").classList.add("hidden"); // Hides the Quit Button
    infoMenu.querySelector("#information-form").setAttribute("isRegistering", 1); // Tells the form this is the user's first time registering
    if(infoMenu.querySelector("#information-form-weight").value!==""){ // If the fields are already filled, we expunge them (Basically, a user could log out, create a new account for whatever reason, and have this pre-filled by their browser. We want to avoid that, so we're getting rid of them)
        infoMenu.querySelector("#information-form-weight").value="";
        infoMenu.querySelector("#information-form-height").value="";
        infoMenu.querySelector("#information-form-age").value="";
    }

    popIn(infoMenu, 500, true);
}

function logoutSequence(){
    localStorage.setItem("token", ""); // We're logging out, so we delete the user's stored token
    window.location.reload(); // Then we reload the whole website, so now he'll be back at the login screen (can't auto-login without a token, after all)
}




// Switches from our current interface(origin) to another interface(destination)
function gotoFrom(destination, origin, height=0, width=0){
    const start = document.getElementById(origin);
    const end = document.getElementById(destination);
    fadeToAnim(start, 0, end, height, width);
}

// Small tool I made myself cuz the syntax to trigger an event manually is pretty annoying when you're using the built-in events instead of custom ones.
function triggerEvent(target, event){
    let newEvent = new Event(event);
    target.dispatchEvent(newEvent);
}




// Lets use slide up and down (only vertical motions) any slider
function slideGrab(slides){
    const slider = document.getElementById(slides);

    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    slider.addEventListener('mousedown', (e) => {
    isDown = true; // Used to indicate we have the mouse down when moving
    startX = e.pageX - slider.offsetLeft; // Gets the coordinates when clicking down
    startY = e.pageY - slider.offsetTop;
    scrollLeft = slider.scrollLeft;
    scrollTop = slider.scrollTop;
    slider.style.cursor = 'grabbing'; // Changes the cursor's style so our user isn't confused
    });

    slider.addEventListener('mouseleave', () => {
    isDown = false; // Shows that the user's mouse is no longer in the slider's area
    slider.style.cursor = 'grab'; // Go back to the regular grab style so the user doesn't think he's still moving stuff
    });

    slider.addEventListener('mouseup', () => {
    isDown = false; // Same thing as above, but for when the user is no longer pressing down
    slider.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
    if (!isDown) return; // Basically cancels the event if the user isn't pressing down 
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft; // Gets the current position
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - startX) * 1; // Handles scroll speed
    const walkY = (y - startY) * 1; // Handles scroll speed
    slider.scrollLeft = scrollLeft - walkX; // Moves our slider
    slider.scrollTop = scrollTop - walkY;
    });
}

// Animates our background (not all that visible, but still)
function bgAnim(){
    const bg = document.getElementById("background");
    let keyframe = {
        transform: [ "rotate(0deg)", "rotate(-20deg)", "rotate(0deg)", "rotate(20deg)", "rotate(50deg)", "rotate(70deg)", "rotate(100deg)", "rotate(120deg)", "rotate(140deg)", "rotate(170deg)", "rotate(200deg)", "rotate(230deg)", "rotate(260deg)", "rotate(290deg)", "rotate(310deg)", "rotate(340deg)", "rotate(360deg)"]
    };
    let option = {
        duration: 5000,
        iterations: Infinity // Means it never stops
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
        element.classList.add("hidden"); // Since our "hidden" class includes a "display: none", we have to explicitly wait for the animation to finish before giving it (gets priority otherwise, regardless of being written prior/after the animation order)
        if(nextElement!=0){ // Checks if there's an element to follow up on or not
            nextElement.classList.remove("hidden"); // If so, remove its "hidden" class
            if(adjustHeight!=0){ // Checks if there's a need to change the height & width of the followed up on element
                nextElement.style.height=adjustHeight+'%';
            }
            if(adjustWidth!=0){
                nextElement.style.width=adjustWidth+'%';
            }
            nextElement.animate({opacity: [0,100]},option);
        }
    });
}

// Takes a page(page) to listen to and alters a button(btn)'s CSS based on whether the given fields(field1->field5) are filled or not.  
function formHightlight(page, btn, colors, ...fields){
    
    let fieldTotal = fields.length;
    const lgbtn = document.getElementById(btn);
    if(lgbtn['isActive']!==1){ // Checks if our legitimate button (the actual element) is already active or not
        lgbtn['isActive']=0; // If not, set it to 0 (inactive) just in case
    }
    const el = document.getElementById(page);
    
    el.addEventListener("input", ()=>{   
        // Get the actual values from our CSS :root variables
        const light = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.bgOn}`), name: colors.bgOn};
        const midgray = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.bgOff}`), name: colors.bgOff};
        
        const faded = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.txtOff}`), name: colors.txtOff};
        const dark = {value: getComputedStyle(document.documentElement).getPropertyValue(`--${colors.txtOn}`), name: colors.txtOn};

        let fieldValid = 0;
        fields.forEach(fl => {
            if(fl!=''){
                let fieldElement = document.getElementById(fl);
                if(fieldElement.value!=''){
                    fieldValid++ // Gets how many fields are valid (filled)
                }
            }
        })
        
        if(fieldValid===fieldTotal){ // If all fields are valid
            if (lgbtn['isActive']!=1){ // But the button isn't active,
                if(getComputedStyle(lgbtn).backgroundColor!=light.value){ // Checks that it's not already lit up
                    colorBgFade(lgbtn, midgray, light); // Fade its color to the proper one
                }
                lgbtn.style.color=dark.value;
                lgbtn.style.backgroundColor=`var(--${light.name})`;
                lgbtn.classList.add('clickable'); // Shows the user they can click on the button
            }
            lgbtn['isActive']=1;
        } else { // If a field is missing
            if(lgbtn['isActive']===1){
                colorBgFade(lgbtn, light, midgray); // Same thing as above, but we don't need to check if it's already lit up or not
                lgbtn.style.color=faded.value;
                lgbtn.style.backgroundColor=`var(--${midgray.name})`;
                lgbtn.classList.remove('clickable'); // Shows the user they can't click on the button
            }
            lgbtn['isActive']=0;
        }
    });
};





async function updateUser(){
    const username = await requests.getName(); // Get USER's name

    let info = await requests.getLastInfo(); // Get latest info of USER
    let units = {weight: "kg", height: "cm"}; // Sets default values for the units

    let storedUnit = localStorage.getItem("unit");
    if(storedUnit==="1"){ // 0=Metric, 1=Imperial. 1==True
        info.weight = utils.toLBS(info.weight); // Turns the collected info's weight from the default KG to LBS
        units.weight = "lbs"; // Switch from KG to LBS
        info.height = utils.toInch(info.height); // Turns the collection info's height from the default CM to INCHES
        units.height = '"'; // Switch from CM to INCHES (" symbol)
        let unitbtn = document.getElementById("settings-unit");
        switchElement(unitbtn.children[0], unitbtn.children[1], storedUnit, storedUnit); // Switches the icons for each options between each others (here it'd be the KG & LBS icons)
    }

    updateTheme();
    let storedTheme = localStorage.getItem("theme");
    if(storedTheme==="1"){
        let themebtn = document.getElementById("settings-theme");
        switchElement(themebtn.children[0], themebtn.children[1], storedTheme, storedTheme); // Same as above (but with the SUN & MOON icons)
    }

    const name = document.getElementById("user-name");
    const weight = {amount: document.getElementById("user-weight-amount"), unit: document.getElementById("user-weight-unit")};
    const height = {amount: document.getElementById("user-height-amount"), unit: document.getElementById("user-height-unit")};

    weight.unit.innerHTML=units.weight; // Edits text to go from our page's weight unit value to our new weight unit value
    height.unit.innerHTML=units.height; // Same but for height
    
    weight.amount.innerHTML=utils.roundNum(info.weight); // Edits text to go from our page's weight value to our new weight value, and round it down to one decimal 
    height.amount.innerHTML=utils.roundNum(info.height); // Same but for height

    name.innerHTML=username; // Edits text to go from our page's default username to our actual username

    // Same thing as above but with the information form
    const editForm = {weight: document.getElementById("information-form-weight"), height: document.getElementById("information-form-height"), age: document.getElementById("information-form-age"), bodytype: document.getElementById("information-form-bodytype"), submit: document.getElementById("information-submit-btn")};
    editForm.weight.value=utils.roundNum(info.weight);
    editForm.weight.nextElementSibling.children[0].innerHTML=units.weight;

    editForm.height.value=utils.roundNum(info.height);
    editForm.height.nextElementSibling.children[0].innerHTML=units.height;

    editForm.age.value=info.age;

    editForm.bodytype.setAttribute("bodyType", info.bodytype);
    switchElement(editForm.bodytype.children[0], editForm.bodytype.children[1], editForm.bodytype.getAttribute("bodyType"), 1); // Same as above (but with the MASC & FEM icons)
    
}

function updateTheme(){
    if(localStorage.getItem("theme")==1){ // Switchs out the CSS :root variables's values based on the theme (0=LIGHT, 1=DARK)
        document.documentElement.style.setProperty('--light', '#b9b9b9');
        document.documentElement.style.setProperty('--dark', '#bfbfbf');
        document.documentElement.style.setProperty('--gray', '#575757');
        document.documentElement.style.setProperty('--midgray', '#979797');
        document.documentElement.style.setProperty('--main', '#DF4040');
        document.documentElement.style.setProperty('--menu', '#777');
        document.documentElement.style.setProperty('--border', '#4d4d4db0');
        document.documentElement.style.setProperty('--content', '#4d4d4d');
        document.documentElement.style.setProperty('--button', '#4f4f4ff5');
        document.documentElement.style.setProperty('--clearsky', '#93969773');
        document.documentElement.style.setProperty('--txton', '#404040');
        document.documentElement.style.setProperty('--days', '#959595');
        document.documentElement.style.setProperty('--bg1', '#9b9b9b');
        document.documentElement.style.setProperty('--bg2', '#6a6a6a');
        document.documentElement.style.setProperty('--bg3', '#8a8a8a');
    } else {
        document.documentElement.style.setProperty('--light', '#ffffff');
        document.documentElement.style.setProperty('--dark', '#2b2b2b');
        document.documentElement.style.setProperty('--gray', '#F1F0FA');
        document.documentElement.style.setProperty('--midgray', '#ccc');
        document.documentElement.style.setProperty('--main', '#01A7C2');
        document.documentElement.style.setProperty('--menu', '#cfe0f7');
        document.documentElement.style.setProperty('--border', '#91b7edb1');
        document.documentElement.style.setProperty('--content', '#98bcec');
        document.documentElement.style.setProperty('--button', '#a6dafcf5');
        document.documentElement.style.setProperty('--clearsky', '#dff9ff73');
        document.documentElement.style.setProperty('--txton', '#2b2b2b');
        document.documentElement.style.setProperty('--days', '#2b2b2b');
        document.documentElement.style.setProperty('--bg1', '#cee1f2');
        document.documentElement.style.setProperty('--bg2', '#a5c8e8');
        document.documentElement.style.setProperty('--bg3', '#d1daf2');
    }
}

async function updateUnit(){ // Since we have a LOT of reliant on a specific unit, it's easier to just reload everything (we could manually edit everything, it'd be more optimized even, but it's just faster that way given the limited amount of time I have)
    updateUser();
    let boxDate = sessionStorage.getItem("currentBox");
    let newEntries = await getEntriesOn(boxDate);
    createEntryBoxes(newEntries, boxDate);
}


// Turns entries into a proper HTML element
function createEntry(el){
    el.primary={};
    el.secondary={};
    if(el.hasOwnProperty("kcal")){ // Checks if it's an act. or con. ("kcal" can only be present in a con.)
        el.secondary.unit=" kcal"; // Sets the secondary information's unit text
        el.secondary.amount=el.kcal; // Sets its value
        el.primary.amount=el.gram; // Do the same for the primary information
        if(localStorage.getItem("unit")==="1"){ // However, if the user is using imperial
            el.primary.amount=utils.roundNum(utils.toLBS(el.primary.amount)/1000, 2); // Converts the data obtained into LBS 
            el.primary.unit=" lbs"; // And set the unit's text to the imperial equivalent
        } else {
            el.primary.unit=" g"; // Otherwise just set the unit's text to metric (since our unit's value doesn't change)
        }
    } else {
        el.primary.unit=" minute(s)"; // Same thing as above
        el.primary.amount=el.duration;
        el.secondary.unit=" kcal/h";
        el.secondary.amount=el.burnrate;
    }
    if (`${el.timeof.hour}`.length==1){ // Formats our time so we don't end up with [10:1] instead of [10:01] or even [2:1] instead of [02:01]
        el.timeof.hour=`0${el.timeof.hour}`;
    }
    if (`${el.timeof.minute}`.length==1){
        el.timeof.minute=`0${el.timeof.minute}`;
    }


    let newEl = document.createElement("div"); // Creates our HTML element with all the necessary data
    newEl.classList.add("manager-content-info-box-entry");
    newEl.setAttribute("entry-data", JSON.stringify({id: el.entryid, type: el.hasOwnProperty("kcal"), primary: el.primary.amount, secondary: el.secondary.amount, comment: el.comment}))
    newEl.innerHTML = `<div class="manager-content-info-box-entry-hour f-idendidad"><p><span class="entry-hour">${el.timeof.hour}</span>:<span class="entry-minute">${el.timeof.minute}</span></p></div><div class="manager-content-info-box-entry-content clickable"><div class="manager-content-info-box-entry-content-details f-idendidad"><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-primary-amount">${el.primary.amount}</span><span class="entry-primary-unit">${el.primary.unit}</span></p></div><div class="manager-content-info-box-entry-content-details-bar"></div><div class="manager-content-info-box-entry-content-details-text"><p><span class="entry-secondary-amount">${el.secondary.amount}</span><span class="entry-secondary-unit">${el.secondary.unit}</span></p></div></div><div class="manager-content-info-box-entry-content-main clickable hidden f-idendidad" ><div class="manager-content-info-box-entry-content-main-bar"></div><div class="manager-content-info-box-entry-content-main-comment"><p>${el.comment}</p></div><div class="manager-content-info-box-entry-content-main-edit"><button class="manager-content-info-box-entry-content-main-edit-button f-iconic">EDIT</button></div></div></div>`; // Keeps ID & Type (true == Cons. & false == Acts.) so we can edit them later.
    return newEl;
}

// Get all entries from a specific day
async function getEntriesOn(date) {
    let startDate = new Date(date);
    let endDate = new Date(date);
    endDate.setDate(endDate.getDate()+1);
    endDate.setMilliseconds(endDate.getMilliseconds()-1);
    startDate.setMinutes(startDate.getMinutes()-startDate.getTimezoneOffset());
    endDate.setMinutes(endDate.getMinutes()-endDate.getTimezoneOffset());
    let newEntries = await requests.getEntriesFrom(startDate, endDate);
    return newEntries;
}

// Loads all entries up
async function createEntryBoxes(entries, date){
    const parent = document.getElementById("entry-menu");
    parent.replaceChildren(); // Clears everything for safety's sake

    if(!date instanceof Date){
        date = new Date(date); // In case we receive a date string instead of a date object, turn it into an actual date object
    }

    let infos = await requests.getInfoFrom(date);
    let goal=0;
    if(infos.bodytype==0){
        goal = (447.593 + (9.247*infos.weight) + (3.098*infos.height) - (4.330*infos.age))*1.2
    } else {
        goal = (88.362 + (13.397*infos.weight) + (4.799*infos.height) - (5.677*infos.age))*1.2
    } // Sets the intake/goal tracker up with that day's goal (useful when we look into the past, since it'll always be the same on a given day no matter how much time passes)

    let intake=0; // Get the total caloric intake of that day
    entries.cons.forEach(cal =>{
        intake+=(cal.kcal*(cal.gram/100));
    });
    entries.acts.forEach(exer =>{
        intake-=((exer.duration/60)*exer.burnrate);
    });

    let newEl = createTracker(intake, goal); // Use the goal & daily intake we got earlier to create an intake/goal tracker with the proper informations
    if(parent.hasChildNodes()){ // Just in case, since we don't want the tracker to ever be shown more than once, we clear everything
        parent.replaceChildren(newEl);
    } else {
        parent.appendChild(newEl);
    }

    entries = entries.cons.concat(entries.acts); // Merges both acts. & cons. together
    try{
        entries.sort(function(a,b){ // Sort them by date (newest to oldest)
            return (b.timeof.hour*100+b.timeof.minute) - (a.timeof.hour*100+a.timeof.minute);
        });
    } catch(e){
        console.log("no entries"); // Can't sort smth that's empty
    };
    for(let i=0; i<entries.length; i++){
        parent.appendChild(createEntry(entries[i])); // Append all entries (which we turn into HTML Elements while we're at it)
    }
    editEntry(); // Re-applies editEntry's event, which lets us use the edit button
}

// Used to switch from Cons. to Acts. & vice-versa when adding/editing an entry
function setEntryType(){
    const btn = document.getElementById("entry-form-type");
    btn.setAttribute("entryType", 0); // set as a Cons. by default
    btn.addEventListener("click", (e) =>{
        if (e.target.getAttribute("entryType")==0){
            e.target.setAttribute("entryType", 1); // 1: Act.
            e.target.value="EXERCISE MODE";
            e.target.form[1].previousElementSibling.innerText="Minutes";
            e.target.form[2].previousElementSibling.innerText="Kcal/h";
        } else {
            e.target.setAttribute("entryType", 0); // 0: Cons.
            e.target.value="INTAKE MODE";
            e.target.form[1].previousElementSibling.innerText="Gram";
            e.target.form[2].previousElementSibling.innerText="Kcal";
        }
    })
}

// Used to update/correct an entry with new informations
async function editEntry(){
    let editMenu = document.getElementById("edit-entry");
    editMenu.replaceWith(editMenu.cloneNode(true)); // Removes all events, since even a deep clone doesn't keep them 
    formHightlight("edit-entry", "edit-entry-submit-btn", defaultHighlight, "edit-entry-form-primary-amount", "edit-entry-form-secondary-amount");  // Highlights the submit button when the primary and secondary fields (gram&kcal || minutes&kcal/h) are filled in the edit entry form
    $(".manager-content-info-box-entry-content-main-edit-button").click(async function(e){ // JQuery since it's easier than doing the same with a .getElementsByClassName() & loops
        let data = JSON.parse(e.target.parentElement.parentElement.parentElement.parentElement.getAttribute("entry-data")); // Gets us the data held within that entry so we can pre-fill stuff with it

        const edit = document.getElementById("edit-entry");
        if (data.type){ // Pre-fills the form based on the type of entry (Cons. & Acts.)
            edit.querySelector("#edit-entry-form-primary-unit").innerText="Gram";
            edit.querySelector("#edit-entry-form-secondary-unit").innerText="Kcal";
        } else {
            edit.querySelector("#edit-entry-form-primary-unit").innerText="Minutes";
            edit.querySelector("#edit-entry-form-secondary-unit").innerText="Kcal/h";
        }
        edit.querySelector("#edit-entry-form-primary-amount").value=data.primary;
        edit.querySelector("#edit-entry-form-secondary-amount").value=data.secondary;
        edit.querySelector("#edit-entry-form-comment").value=data.comment;

        triggerEvent(edit, "input"); // Manually trigger the input event so the highlight updates right from the get-go
        popIn(edit, 500, true);

        edit.querySelector("#exit-edit-entry").addEventListener("click", ()=>{
            popOut(edit, 500, true);
        })

        edit.querySelector("#edit-entry-delete").addEventListener("click", ()=>{
            popIn(document.getElementById("warning"), 500, true);
            setWarning("Are you sure\nyou'd like to\ndelete this\nentry?\nThis cannot be undone.", "YES", ()=>{
                requests.deleteEntry(data); // Sends out the kill order (o7)
                let entryDiv = e.target.parentElement.parentElement.parentElement.parentElement; // For (possible) future maintainability's sake
                entryDiv.remove(); // Shows to the user the results of their actions ('em bastards are effin' monsters, I tell ya!)
                popOut(edit, 500, true);
                updateTracker(); // Updates the tracker to account for the removed (burned) calories
            })
        })

        edit.addEventListener("submit", async (s)=>{
            s.preventDefault();
            popOut(edit, 500, true);
            data.primary=s.target[1].valueAsNumber; // Ensures we don't get a string
            data.secondary=s.target[2].valueAsNumber;
            data.comment=s.target[3].value;

            let entry = e.target.parentElement.parentElement.parentElement; // Visually updates the entry's data
            entry.querySelector(".entry-primary-amount").innerHTML=data.primary;
            entry.querySelector(".entry-secondary-amount").innerHTML=data.secondary;
            entry.querySelector(".manager-content-info-box-entry-content-main-comment").children[0].innerHTML=data.comment;

            entry.parentElement.setAttribute("entry-data", JSON.stringify(data)); // Updates the data held within that entry
            
            await requests.editEntry(data); // Sends out the request to actually update the entry in the DB
            updateTracker(); // Updates the tracker to account for the added/removed (burned) calories.
        }, { once: true }) // Once, to avoid duplicate submits
    });
}




// Turns our day into a proper HTML Element
function createDay(el){
    let newEl = document.createElement("div");
    newEl.classList.add("manager-content-slider-box");
    newEl.classList.add("f-idendidad");
    newEl.classList.add("no-select");
    newEl.classList.add("smallbox-modifier");
    newEl.setAttribute("getDate", `${el.timeof.year}-${el.timeof.month}-${el.timeof.day}`);
    newEl.innerHTML = `<div class="manager-content-slider-box-date"><p><span>${el.timeof.day}</span>/<span>${el.timeof.month}</span></p></div><div class="manager-content-slider-box-year"><p>${el.timeof.year}</p></div>`;
    return newEl;
}

// Displays our days on the slider
async function createDayBoxes(){
    const parent = document.getElementById("content-slider");
    let entries = await requests.getEntries();
    parent.replaceChildren(); // Wipes everything out to be safe

    try{
        entries.cons.sort(function(a,b){
            return new Date(b.timeof.year+"-"+b.timeof.month+"-"+b.timeof.day) - new Date(a.timeof.year+"-"+a.timeof.month+"-"+a.timeof.day);
        });
        entries.acts.sort(function(a,b){
            return new Date(b.timeof.year+"-"+b.timeof.month+"-"+b.timeof.day) - new Date(a.timeof.year+"-"+a.timeof.month+"-"+a.timeof.day);
        });
    } catch(e){
        console.log("no days")
    }

    let elFirst = true;
    let allDays = [];
    for(let i=0; i<Object.keys(entries).length; i++){
        let currentDay;
        Object.entries(entries)[i][1].forEach(async el =>{
            currentDay = el.timeof.year+"-"+el.timeof.month+"-"+el.timeof.day
            if(!allDays.includes(currentDay)){ // Checks if a day is NOT in our list of days
                let newEl = createDay(el);
                if(elFirst){ // First element is always the one focused on when starting up 
                    newEl.classList.add("bigbox-modifier");
                    newEl.classList.remove("smallbox-modifier"); // All days have this class by default, so we have to strip it away too
                    sessionStorage.setItem("currentBox", currentDay); // Makes it so we know what day box is currently opened from anywhere
                    elFirst=false; // Ensures we don't have two "first" day boxes
                }
                parent.appendChild(newEl);
            }
            allDays.push(currentDay); // Adds to our list any day that wasn't already in there
        }
    )}
    let getDate = sessionStorage.getItem("currentBox"); // Since currentDay gets overwritten a lot, we check directly what we stored in sessionStorage
    let newEntries = await getEntriesOn(getDate);
    createEntryBoxes(newEntries, getDate); // Create our entries to show in the first day box (the one we're focused on)
    dayBoxClick() // Re-applies dayBoxClick's event so we can click on the newly created days
}

function dayBoxClick(){
    $(".manager-content-slider-box").click(async function(e){ // Use JQuery to get when any single element with that class is clicked

        let modifier = e.currentTarget.classList.contains("bigbox-modifier");
        const slider = document.getElementById("content-slider");
        const bigbox = $(slider).find(".bigbox-modifier"); // Using JQuery because it's more concise than looping through every children of slider to find the only one(1) with that class
        if(!modifier){ // If it doesn't have the bigbox modifier
            // When it's small & we click on it do:
            bigbox[0].classList.remove("bigbox-modifier"); // turn small the box we were focusing on previously
            bigbox[0].classList.add("smallbox-modifier"); 
            e.currentTarget.classList.remove("smallbox-modifier"); // turn big the box we're currently focusing on
            e.currentTarget.classList.add("bigbox-modifier");
        };

        let boxDate = e.currentTarget.getAttribute("getDate"); // Our day boxes have an attribute to directly get the date as a JSON, so we get it from our click
        sessionStorage.setItem("currentBox", boxDate); // Changes our currentBox, since we changed box
        let newEntries = await getEntriesOn(boxDate);
        createEntryBoxes(newEntries, boxDate); // Create the entries from our currently opened day box
    });
}



// Turns our intake/goal tracker into a proper HTML Element
function createTracker(intake, goal){
    let newEl = document.createElement("div");
    newEl.id="tracker-goal";
    newEl.classList.add("manager-content-info-box-goal");
    newEl.classList.add("f-idendidad");
    newEl.innerHTML = `<p><span id="day-intake">${utils.roundNum(intake)}</span>&nbsp/&nbsp<span id="day-goal">${utils.roundNum(goal)}</span>&nbspkcal</p>`;
    return newEl;
}

// Update the tracker to account for new changes
async function updateTracker(){
    let date = sessionStorage.getItem("currentBox");
    let entries = await getEntriesOn(date);
    let infos = await requests.getInfoFrom(date);

    let goal=0;
    if(infos.bodytype==0){ // Re-calculate the TDEE
        goal = (447.593 + (9.247*infos.weight) + (3.098*infos.height) - (4.330*infos.age))*1.2
    } else {
        goal = (88.362 + (13.397*infos.weight) + (4.799*infos.height) - (5.677*infos.age))*1.2
    }

    let intake=0; // Re-calculate that day's INTAKE
    entries.cons.forEach(cal =>{
        intake+=(cal.kcal*(cal.gram/100));
    });
    entries.acts.forEach(exer =>{
        intake-=((exer.duration/60)*exer.burnrate);
    });

    let newTracker = createTracker(intake, goal); // Create the HTML element with our newly re-calculated data
    document.getElementById("tracker-goal").replaceWith(newTracker); // Replace the old one with our new one
}




// Pops our element out (with a fading animation), and executes a function if requested
function popOut(element, speed=500, bg=false, extraFunc){
    if(sessionStorage.getItem("currentPopup")==="information"){
        sessionStorage.setItem("currentPopup", "settings"); // Updates the current popup, and since the Informations menu is the only one to overlap with another, just hard-coded it for now (might change it later, if I keep maintaining this)
    } else {
        sessionStorage.setItem("currentPopup", "");
    }
    let keyframe = {
        opacity: [100,0]
    };
    let option = {
        duration: speed,
        ease: "easing"
    };
    let anim = element.animate(keyframe, option);
    anim.addEventListener('finish', () => {
        element.classList.add("hidden");
    });
    if(bg){
        let bgElement = document.getElementById("inactive-bg");
        let bganim = bgElement.animate(keyframe, option);
        bganim.addEventListener('finish', () => {
            bgElement.classList.add("hidden");
        });
    }
    extraFunc?.(); // basically the equivalent of having a default "()=>{}" in the params, just won't do anything unless there's an actual function passed
}

// Pops our element in (with a fading animation), and executes a function if requested
function popIn(element, speed=500, bg=false, extraFunc){ // Same shit as above but for popping in
    if(element.id!==""){
        sessionStorage.setItem("currentPopup", element.id);
    }
    element.classList.remove("hidden");
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
    extraFunc?.(); // basically the equivalent of having a default "()=>{}" in the params, just won't do anything unless there's an actual function passed
}


// Handles popups automatically (aka, puts together popIn & popOut in a ready to use function to make life easier)
function popupHandler(element, entryBtn, exitBtn, speed=500, bg=false, extraFunc){
    const el = document.getElementById(element);
    const entrance = document.getElementById(entryBtn);
    const exit = document.getElementById(exitBtn);


    if(entryBtn!=exitBtn){
        entrance.addEventListener("click", ()=> {
            if(el.classList.contains("hidden")){
                extraFunc?.();
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
                extraFunc?.();
                popIn(el, speed, bg);
            } else {
                popOut(el, speed, bg);
            }
        })
    }
}

// Handles exiting popups without clicking on an actual button, just a key
function exitPopup(){
    window.addEventListener("keydown", (e)=>{
        if(e.key==="Escape" && document.getElementById("information").children[1].children[0].getAttribute("isRegistering")!=1){ // if pressing Escape & user is not registering
            let popup = sessionStorage.getItem("currentPopup"); // gets what popup is currently displayed
            if(popup!==""){ // checks if there's a popup displayed or not 
                if(popup!=="information"){ // hard checks if it's our Information menu or not
                    popOut(document.getElementById(popup), 500, true);
                } else {
                    popOut(document.getElementById(popup)); // Since information is the only popup without a bg
                }
            }
        }
    })
}




// Switches an item's value in localStorage for another value
function switchCacheValue(btn, item, valueOn=1, valueOff=0, effectFunc){
    const element = document.getElementById(btn);
    element.addEventListener("click", ()=>{
        if(localStorage.getItem(item)==valueOn){
            localStorage.setItem(item, valueOff);
            effectFunc?.();
        } else {
            localStorage.setItem(item, valueOn);
            effectFunc?.();
        }
    })
}

// Switches an element's attribute's value for another value
function switchElementAttribute(btn, item, valueOn=1, valueOff=0, effectFunc){
    const element = document.getElementById(btn);
    element.addEventListener("click", ()=>{
        if(element.getAttribute(item)==valueOn){
            element.setAttribute(item, valueOff);
            effectFunc?.();
        } else {
            element.setAttribute(item, valueOn);
            effectFunc?.();
        }
    })
}

// Visually switches an element for another (pops out first element, then pops in second element)
function switchElement(firstEl, secondEl, anchorData, dataOn){
    if (anchorData!=dataOn){
        secondEl.classList.add("hidden");
        popIn(firstEl);
    } else {
        firstEl.classList.add("hidden");
        popIn(secondEl);
    }
}

// Takes a text field(textID) and executes a given function(textGetFunc) when a specific type of event(eventTrigger) is triggered to edit the HTML contained within said text field.
function updateText(eventTrigger, textID, textGetFunc){
    const text = document.getElementById(textID);
    window.addEventListener(eventTrigger, function(){
        text.innerHTML=textGetFunc;
    })
};

// Let's us display an element's child when clicking on said element (and hiding said child if it's already displayed)
function openElement(clickedParent, targetChild, exceptChild=""){
    $(document).on("click", `.${clickedParent}`,function(e){ // Use JQuery to get when any single element with that class is clicked
        let childID;
        for(let i = 0; i<e.currentTarget.children.length; i++){
            if(e.currentTarget.children[i].classList.contains(targetChild)){ 
                childID=i; // Gets our (targeted) child's position within its parent
                break;
            }
        };

        if(!e.target.classList.contains(exceptChild)){ // Checks if the exact div we clicked on has our "exceptChild" class in it (Particularly useful for our entries' "Edit" button, since it allows us not to close down an entry's detail when clicking to edit it)
            if(!e.currentTarget.children[childID].classList.contains("hidden")){
                //When it's visible do:
                e.currentTarget.children[childID].classList.add("hidden");
            } else {
                // When it's hidden do:
                e.currentTarget.children[childID].classList.remove("hidden");
            };
        }
    });
}



// Sets our warning message's text(s) (and possible behaviour)
function setWarning(txtMsg, txtBtn="YES", extraFunc){
    const warnMsg = document.getElementById("warning-message");
    const warnBtn = document.getElementById("warning-btn");
    warnMsg.children[0].innerText=txtMsg;
    warnBtn.children[0].innerHTML=txtBtn;

    let content = document.getElementById("warning-content");
    content.replaceWith(content.cloneNode(true)); // Replaces node with itself so we can get rid of all those damned event that may remain (fuck em)
    content = document.getElementById("warning-content"); // Since we replaced it, albeit with a near-identical copy of itself, the element of our "content" doesn't exist in our DOM anymore so we have to get it again
    content.addEventListener("submit", (e)=>{
        e.preventDefault();
        popOut(content.parentElement, 500, true);
        extraFunc?.(); // Triggers a function (if it's been passed) upon clicking our warning message's main button
    }, {once: true}) // Once again, using once to avoid having duplicate submits
}