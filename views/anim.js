window.addEventListener("load", function(){
    
    bgAnim(); // Should never stop, animates the background
    
    formHightlight("sign-login", "login-btn", "login-field-email", "login-field-password"); // Triggers when the email & password fields are filled in the login form
    formHightlight("sign-register", "register-btn", "register-field-nickname", "register-field-email", "register-field-password"); // Triggers when the username, email & password fields are filled in the sign up form

    switchInterface("sign-login", "sign-register", "register", '75'); // Triggers when going to the sign up form from login page
    switchInterface("sign-register", "sign-login", "login"); // Triggers when going back to the login form from the sign up page
    
    user.tokenLog().then(data => {
        console.log(data)
        if(data){
            gotoFrom("manager", "sign-login");
        }
    })

    $('#login-form').submit(function(e) {
        e.preventDefault();
        user.login(e).then(data=>{
            if(data.status){
                gotoFrom("manager", "sign-login");
            } else {
                console.log("error pswd mail")
            };
        })
    })

    $('#register-form').submit(function(e) {
        e.preventDefault();
        user.register(e).then(data=>{
            if(data.status){
                gotoFrom("manager", "sign-register");
            } else {
                console.log("error mail")
            };
        })
    })
})


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


//
function gotoFrom(destination, origin){
    const start = document.getElementById(origin);
    const end = document.getElementById(destination);
    fadeToAnim(start, 0, end);
}


//
function switchInterface(crnt, nxt, btn, height=0, width=0){
    const current = document.getElementById(crnt);
    const next = document.getElementById(nxt);
    const button = document.getElementById(btn);

    button.addEventListener("click", function(){
        fadeToAnim(current, 0, next, height, width);
    });
}


//
function colorBgAnim(element, colorStart, colorEnd){
    let keyframe = {
        backgroundColor: [colorStart.value, colorEnd.value]
    };
    let option = {
        duration: 700,
        ease: "easing"
    };
    element.animate(keyframe, option);
}


//
function fadeToAnim(element, newOpacity, nextElement, adjustHeight=0, adjustWidth=0){
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
        nextElement.style.display = 'flex';
        if(adjustHeight!=0){
            nextElement.style.height=adjustHeight+'%';
        }
        if(adjustWidth!=0){
            nextElement.style.width=adjustWidth+'%';
        }
        let nextAnim = nextElement.animate({opacity: [0,100]},option)
      });
}


//
function formHightlight(div, btn, field1, field2='', field3='', field4='', field5=''){
    
    let fields=[field1, field2, field3, field4, field5];
    let fieldTotal = 0;
    fields.forEach(fl => {
        if(fl!=''){
            fieldTotal++;
        }
    })

    var isActive=0;
    const sign = document.getElementById(div);
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
                colorBgAnim(lgbtn, midgray, light)
                lgbtn.style.color=dark.value;
                lgbtn.style.backgroundColor=`var(--${light.name})`;
                lgbtn.classList.add('clickable')
            }
            isActive=1;
        } else {
            if(isActive===1){
                colorBgAnim(lgbtn, light, midgray)
                lgbtn.style.color=faded.value;
                lgbtn.style.backgroundColor=`var(--${midgray.name})`;
                lgbtn.classList.remove('clickable')
            }
            isActive=0;
        }
    });
};