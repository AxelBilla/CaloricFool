window.addEventListener("load", function(){
    
    bgAnim(); // Should never stop, animates the background
    formHightlight("sign-login", "login-btn", "login-field-email", "login-field-password"); // Triggers when the email & password fields are filled in the login form
    formHightlight("sign-register", "register-btn", "register-field-nickname", "register-field-email", "register-field-password"); // Triggers when the username, email & password fields are filled in the sign up form
    slideGrab("content-slider", "content-slider");
    slideGrab("entry", "entry-slider");
    
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
    
    //
    user.tokenLog().then(data => {
        if(data){
            loginSequence();
        }
    })

    //
    $('#login-form').submit(function(e) {
        e.preventDefault();
        user.login(e).then(data=>{
            if(data.status){
                loginSequence();
            } else {
                console.log("error pswd mail")
            };
        })
    })

    //
    $('#register-form').submit(function(e) {
        e.preventDefault();
        user.register(e).then(data=>{
            if(data.status){
                registerSequence()
            } else {
                console.log("error mail")
            };
        })
    })
})

function loginSequence(){
    gotoFrom("manager", "sign-login");
    updateUserInfo();
}

function registerSequence(){
    gotoFrom("manager", "sign-register");
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


// Switches from our current interface(origin) to another interface(destination)
function gotoFrom(destination, origin, height=0, width=0){
    const start = document.getElementById(origin);
    const end = document.getElementById(destination);
    fadeToAnim(start, 0, end, height, width);
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
        display: 'none'
    };
    let option = {
        duration: 700,
        ease: "easing"
    };
    let anim = element.animate(keyframe, option);
    anim.addEventListener('finish', () => {
        element.style.display = 'none';
        if(nextElement!=0){
            nextElement.style.display = 'flex';
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
function formHightlight(page, btn, field1, field2='', field3='', field4='', field5=''){
    
    let fields=[field1, field2, field3, field4, field5];
    let fieldTotal = 0;
    fields.forEach(fl => {
        if(fl!=''){
            fieldTotal++;
        }
    })

    var isActive=0;
    const sign = document.getElementById(page);
    sign.addEventListener("keyup", function(){
        const lgbtn = document.getElementById(btn);
        
        const light = {value: getComputedStyle(document.documentElement).getPropertyValue('--light'), name: 'light'};
        const midgray = {value: getComputedStyle(document.documentElement).getPropertyValue('--midgray'), name: 'midgray'};
        
        const faded = {value: getComputedStyle(document.documentElement).getPropertyValue('--fadedtxt'), name: 'faded'};
        const dark = {value: getComputedStyle(document.documentElement).getPropertyValue('--dark'), name: 'dark'};

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
            if (isActive!=1){
                colorBgFade(lgbtn, midgray, light)
                lgbtn.style.color=dark.value;
                lgbtn.style.backgroundColor=`var(--${light.name})`;
                lgbtn.classList.add('clickable')
            }
            isActive=1;
        } else {
            if(isActive===1){
                colorBgFade(lgbtn, light, midgray)
                lgbtn.style.color=faded.value;
                lgbtn.style.backgroundColor=`var(--${midgray.name})`;
                lgbtn.classList.remove('clickable')
            }
            isActive=0;
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
        console.log(e.pageY)
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
    const settings = await user.getSettings(); // Get USER's settings
    const username = await user.getName(); // Get USER's name

    let info = await user.getLastInfo(); // Get latest info of USER
    let units = {weight: "kg", height: "cm"}; // Sets default values for the units

    if (settings.unit){ // 0=Metric, 1=Imperial. 1==True
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

}