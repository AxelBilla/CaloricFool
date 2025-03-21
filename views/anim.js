window.addEventListener("load", function(){
    
    bgAnim(); // Should never stop
    
    logHightlight(); //Triggers when both email & pswd fields are filled in the login form
    switchInterface("sign-login", "sign-register", "register"); // Triggers when going to the sign up form from login page

    //regHightlight();  //Triggers when the username, email & pswd fields are filled in the login form
    logEnter(); // Triggers when going back to the login page from the sign up form

    $('#login-form').submit(async function(e) {
        e.preventDefault();
        user.checkLogin(e).then(resp => resp.json().then(data=>{
            if(data){
                signQuit("sign-login");
            } else {
                console.log("error pswd mail")
            };
            })
        )}
    )
    $('#register-form').submit(async function(e) {
        e.preventDefault();
        user.checkLogin(e).then(resp => resp.json().then(data=>{
            if(data){
                signQuit("sign-register");
            } else {
                console.log("error pswd mail")
            };
            })
        )}
    )
})

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

function logHightlight(){
    var isActive=0;
    const sign = document.getElementById("sign");
    sign.addEventListener("keyup", function(){
        const lgbtn = document.getElementById("login-btn");
        const femail = document.getElementById("field-email");
        const fpass = document.getElementById("field-password");
        
        const light = {value: getComputedStyle(document.documentElement).getPropertyValue('--light'), name: 'light'};
        const midgray = {value: getComputedStyle(document.documentElement).getPropertyValue('--midgray'), name: 'midgray'};
        
        const faded = {value: getComputedStyle(document.documentElement).getPropertyValue('--fadedtxt'), name: 'faded'};
        const dark = {value: getComputedStyle(document.documentElement).getPropertyValue('--dark'), name: 'dark'};

        if(femail.value!='' && fpass.value!=''){
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

function signQuit(id){
    const sign = document.getElementById(id);
    const main = document.getElementById("manager");
    fadeToAnim(sign, 0, main);
}

function switchInterface(crnt, nxt, btn){
    const current = document.getElementById(crnt);
    const next = document.getElementById(nxt);
    const button = document.getElementById(btn);

    button.addEventListener("click", function(){
        fadeToAnim(current, 0, next);
    });
}

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

function fadeToAnim(element, newOpacity, nextElement){
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
        let nextAnime = nextElement.animate({opacity: [0,100]},option)
      });
}






function formHightlight(form, btn, field1, field2="", field3="", field4=""){
    
    let fields=[field1, field2, field3, field4];

    var isActive=0;
    const sign = document.getElementById(form);
    sign.addEventListener("keyup", function(){
        const lgbtn = document.getElementById(btn);
        //const femail = document.getElementById("field-email");
        //const fpass = document.getElementById("field-password");
        
        const light = {value: getComputedStyle(document.documentElement).getPropertyValue('--light'), name: 'light'};
        const midgray = {value: getComputedStyle(document.documentElement).getPropertyValue('--midgray'), name: 'midgray'};
        
        const faded = {value: getComputedStyle(document.documentElement).getPropertyValue('--fadedtxt'), name: 'faded'};
        const dark = {value: getComputedStyle(document.documentElement).getPropertyValue('--dark'), name: 'dark'};

        fields.forEach(el => {
            if(el!=""){
                let getEl = document.getElementById(el);
                // KEEP ON GOING
            }
        })
        
        if(fieldval){
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