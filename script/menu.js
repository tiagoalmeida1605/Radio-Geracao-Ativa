const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-Menu");
const menuOverlay = document.getElementById("menuOverlay");

if (!menuBtn || !navMenu) {
} else {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-controls", "nav-Menu");

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("active");
  if (menuOverlay) menuOverlay.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-aberto", isOpen);
  menuBtn.textContent = isOpen ? "✕" : "☰";
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

menuBtn.addEventListener("click", toggleMenu);

if (menuOverlay) {
  menuOverlay.addEventListener("click", toggleMenu);
}
}