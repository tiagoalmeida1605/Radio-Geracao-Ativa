const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-Menu");
const menuOverlay = document.getElementById("menuOverlay");
const themeToggle = document.getElementById("themeToggle");

function renderizarIconeLucide(elemento, icone) {
  if (!elemento) return;

  elemento.innerHTML = `<i data-lucide="${icone}" aria-hidden="true"></i>`;
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

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
    renderizarIconeLucide(themeToggle, modoEscuro ? "sun" : "moon");
  }
}

// Aplicar o tema definido no atributo data-theme do elemento HTML
// Isso permite que o tema seja fixo para páginas públicas (definido no HTML)
// e ainda funcione para o admin onde o tema pode ser alterado dynamicamente
try {
  const temaAtual = document.documentElement.dataset.theme;
  if (temaAtual) {
    aplicarTema(temaAtual);
  } else {
    aplicarTema("light"); // fallback padrão
  }
} catch {
  aplicarTema("light");
}

// Só permite alternar e salvar o tema se o botão de tema existir (área administrativa)
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
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
}

if (menuBtn && navMenu) {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-controls", "nav-Menu");

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle("active");
    if (menuOverlay) menuOverlay.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-aberto", isOpen);
    renderizarIconeLucide(menuBtn, isOpen ? "x" : "menu");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  menuBtn.addEventListener("click", toggleMenu);

  if (menuOverlay) {
    menuOverlay.addEventListener("click", toggleMenu);
  }
}

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}
