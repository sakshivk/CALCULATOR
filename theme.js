const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
const THEME_KEY = "calculator-theme";

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  themeToggleButtons.forEach((button) => {
    button.textContent = theme === "dark" ? "Light" : "Dark";
    button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(currentTheme === "light" ? "dark" : "light");
}

setTheme(getInitialTheme());

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", toggleTheme);
});
