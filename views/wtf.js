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
    element.addEventListener("click", (e)=>{
        if(localStorage.getItem(item)==valueOn){
            localStorage.setItem(item, valueOff);
            effectFunc();
        } else {
            localStorage.setItem(item, valueOn);
            effectFunc();
        }
    })
}