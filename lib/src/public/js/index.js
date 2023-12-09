const nightMode = document.getElementById('night-mode');
const bodyElement = document.getElementById('body')
const loginBtn = document.getElementById("login-btn")
nightMode.addEventListener("click", changeBodyBackground);

function changeBodyBackground(){
  bodyElement.classList.toggle("changeBackground");
  changeLoginBtn(bodyElement.classList.contains('changeBackground'))
}


function changeLoginBtn(isNightMode){
    if(isNightMode){
        loginBtn.style.backgroundColor = '#042651';
        loginBtn.style.color = '#ffff';
    }
    else{
        loginBtn.style.backgroundColor = '#fff';
        loginBtn.style.color = '#042651';
    }
}