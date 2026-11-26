(() => {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  try {
    if (localStorage.getItem(storageKey) === "light") root.dataset.theme = "light";
  } catch {}

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme");
    function updateButton() {
      const dark = root.dataset.theme === "dark";
      button.textContent = dark ? "☀" : "☾";
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    updateButton();
    button.hidden = false;
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, root.dataset.theme); } catch {}
      updateButton();
    });
  });
})();
