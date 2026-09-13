const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-Menu");
const menuOverlay = document.getElementById("menuOverlay");
const themeToggle = document.getElementById("themeToggle");

function aplicarTema(tema) {
  const temaAtual = tema === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = temaAtual;

  if (themeToggle) {
    const modoEscuro = temaAtual === "dark";
    themeToggle.setAttribute(
      "aria-label",
      modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"
    );
    themeToggle.title = modoEscuro ? "Ativar modo claro" : "Ativar modo escuro";
    const span = themeToggle.querySelector("span");
    if (span) {
      span.textContent = modoEscuro ? "☀" : "◐";
    }
  }
}

try {
  const temaSalvo = localStorage.getItem("rga-theme");
  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else {
    const prefereEscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(document.documentElement.dataset.theme || (prefereEscuro ? "dark" : "light"));
  }
} catch {
  aplicarTema(document.documentElement.dataset.theme || "light");
}

themeToggle?.addEventListener("click", () => {
  const proximoTema = document.documentElement.dataset.theme === "dark"
    ? "light"
    : "dark";
  aplicarTema(proximoTema);
  try {
    localStorage.setItem("rga-theme", proximoTema);
  } catch {
    // Modo privado com storage restrito
  }
});

if (menuBtn && navMenu) {
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
