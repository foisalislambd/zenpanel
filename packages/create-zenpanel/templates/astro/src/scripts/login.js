import { DEMO_PASSWORD, DEMO_USERNAME, adminConfig } from "./config.js";
import { login, requireGuest } from "./auth.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

initTheme();

if (!requireGuest()) {
  // Already signed in — redirect in progress.
} else {
  const brand = adminConfig.brand;
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  const themeBtn = document.getElementById("theme-toggle");

  const brandLetter = document.getElementById("brand-letter");
  const mobileBrand = document.getElementById("mobile-brand");
  const brandName = document.getElementById("brand-name");
  const brandDesc = document.getElementById("brand-desc");
  const brandFeatures = document.getElementById("brand-features");

  if (brandLetter) brandLetter.textContent = brand.letter;
  if (mobileBrand) mobileBrand.textContent = brand.letter;
  if (brandName) brandName.textContent = brand.name;
  if (brandDesc) brandDesc.textContent = brand.loginDescription;
  if (brandFeatures) {
    brandFeatures.innerHTML = brand.loginFeatures
      .map(
        (f) =>
          `<li style="display:flex;gap:0.75rem;align-items:center;margin:0.75rem 0"><span style="display:inline-flex;height:1.25rem;width:1.25rem;align-items:center;justify-content:center;border-radius:999px;background:rgba(70,95,255,0.3);font-size:12px">✓</span>${escapeHtml(f)}</li>`,
      )
      .join("");
  }

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  if (usernameInput) usernameInput.value = DEMO_USERNAME;
  if (passwordInput) passwordInput.value = DEMO_PASSWORD;

  function syncThemeButton() {
    if (!themeBtn) return;
    const dark = getTheme() === "dark";
    themeBtn.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode",
    );
    themeBtn.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" style="width:20px;height:20px"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  themeBtn?.addEventListener("click", () => {
    toggleTheme();
    syncThemeButton();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) errorEl.hidden = true;

    const username =
      usernameInput?.value.trim() || DEMO_USERNAME;
    const password = passwordInput?.value ?? "";

    if (password !== DEMO_PASSWORD) {
      if (errorEl) {
        errorEl.textContent =
          "Invalid credentials. Use admin / admin for the preview.";
        errorEl.hidden = false;
      }
      return;
    }

    login(username);
    window.location.replace("/admin");
  });

  syncThemeButton();
}
