const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-Menu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  if (navMenu.classList.contains("active")) {
    menuBtn.textContent = "✕";
  } else {
    menuBtn.textContent = "☰";
  }
});