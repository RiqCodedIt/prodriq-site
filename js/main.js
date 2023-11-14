const hamburger = document.querySelector(".hamburger");
const mainNav = document.querySelector(".nav-menu");
// On click



function sideMenu() {
    hamburger.addEventListener("click", () => {
        // Toggle class "is-active"
        hamburger.classList.toggle("active");
        mainNav.classList.toggle("active");
        });
}