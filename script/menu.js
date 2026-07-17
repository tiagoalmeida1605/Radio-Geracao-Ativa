const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-Menu");
const menuOverlay = document.getElementById("menuOverlay");

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("active");
  if (menuOverlay) menuOverlay.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-aberto", isOpen);
  menuBtn.textContent = isOpen ? "✕" : "☰";
}

menuBtn.addEventListener("click", toggleMenu);

if (menuOverlay) {
  menuOverlay.addEventListener("click", toggleMenu);
}