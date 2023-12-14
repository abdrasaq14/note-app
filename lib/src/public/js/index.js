const nightMode = document.getElementById("night-mode");
const dayMode = document.getElementById("day-mode");
const smallNightMode = document.getElementById("small-night-mode");
const smallDayMode = document.getElementById("small-day-mode");
const bodyElement = document.getElementById("body");
const loginBtn = document.getElementById("login-btn");
const smallScreenPopUp = document.getElementById("mobile-screen-display");
const displaySmallScreenPopup = document.getElementById("small-screen-bar")
const hideSmallScreenPopup = document.getElementById("close-pop-up-icon")

document.addEventListener("DOMContentLoaded", function () {
  nightMode.style.display = "none";
  smallNightMode.style.display = "none";
  window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    const headerOffset = header.offsetHeight;
  
    if (window.scrollY > headerOffset) {
      header.classList.add("sticky-header");
    } else {
      header.classList.remove("sticky-header");
    }
  });
});
/*when daymode isc clicked, that
measn it's nightmode that was on before, 
so the daymode icon display is none, 
*/

dayMode.addEventListener("click", function () {
  changeBodyBackground();
});

nightMode.addEventListener("click", function () {
  changeBodyBackground();
});


// display small screen pop
displaySmallScreenPopup.addEventListener("click", function(){
    smallScreenPopUp.style.right= "0px"
    hideSmallScreenPopup.addEventListener('click', function(){
        smallScreenPopUp.style.right= "-20000px"
    })
})

smallDayMode.addEventListener("click", function () {
  smallChangeBodyBackground();
});

smallNightMode.addEventListener("click", function () {
    smallChangeBodyBackground();
});

function smallChangeBodyBackground() {
  smallDayMode.style.display =
    smallDayMode.style.display === "none" ? "inline-block" : "none";
  smallNightMode.style.display =
    smallNightMode.style.display === "none" ? "inline-block" : "none";
  bodyElement.classList.toggle("changeBackground");
  changeLoginBtn(bodyElement.classList.contains("changeBackground"));
}
function changeBodyBackground() {
  dayMode.style.display =
    dayMode.style.display === "none" ? "inline-block" : "none";
  nightMode.style.display =
    nightMode.style.display === "none" ? "inline-block" : "none";
  bodyElement.classList.toggle("changeBackground");
  changeLoginBtn(bodyElement.classList.contains("changeBackground"));
}

// this will check if the bodyElement contains a class which is changebackground
function changeLoginBtn(isNightMode) {
    if (isNightMode) {
    loginBtn.style.backgroundColor = "#042651";
    loginBtn.style.color = "#ffff";
    // smallScreenPopUp.style.backgroundColor = "#042651";
    // smallScreenPopUp.style.color = "#ffff";
  } else {
    loginBtn.style.backgroundColor = "#fff";
    loginBtn.style.color = "#042651";
    // smallScreenPopUp.style.backgroundColor = "#f4f4f4";
    // smallScreenPopUp.style.color = "#042651";
  }
}
