import { DEMO_PASSWORD, DEMO_USERNAME, adminConfig } from "./config.js";
import { login, requireGuest } from "./auth.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";
import { escapeHtml, refreshIcons } from "./utils.js";

initTheme();

if (!requireGuest()) {
  // Already signed in — redirect in progress.
} else {
  const brand = adminConfig.brand;
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  const themeBtn = document.getElementById("theme-toggle");
  const submitBtn = document.getElementById("login-submit");
  const passwordInput = document.getElementById("admin-password");
  const usernameInput = document.getElementById("admin-username");
  const togglePasswordBtn = document.getElementById("toggle-password");

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
        (f) => `
        <li class="flex items-center gap-3">
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-200">✓</span>
          ${escapeHtml(f)}
        </li>
      `,
      )
      .join("");
  }

  if (usernameInput) usernameInput.value = DEMO_USERNAME;
  if (passwordInput) passwordInput.value = DEMO_PASSWORD;

  let showPassword = false;

  function syncThemeButton() {
    if (!themeBtn) return;
    const dark = getTheme() === "dark";
    themeBtn.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode",
    );
    themeBtn.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" class="h-5 w-5"></i>`;
    refreshIcons();
  }

  function syncPasswordToggle() {
    if (!passwordInput || !togglePasswordBtn) return;
    passwordInput.type = showPassword ? "text" : "password";
    togglePasswordBtn.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password",
    );
    togglePasswordBtn.innerHTML = `<i data-lucide="${showPassword ? "eye-off" : "eye"}" class="h-4 w-4"></i>`;
    refreshIcons();
  }

  themeBtn?.addEventListener("click", () => {
    toggleTheme();
    syncThemeButton();
  });

  togglePasswordBtn?.addEventListener("click", () => {
    showPassword = !showPassword;
    syncPasswordToggle();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) errorEl.hidden = true;

    const username = usernameInput?.value.trim() || DEMO_USERNAME;
    const password = passwordInput?.value ?? "";

    if (password !== DEMO_PASSWORD) {
      if (errorEl) {
        errorEl.textContent =
          "Invalid credentials. Use admin / admin for the preview.";
        errorEl.hidden = false;
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Signing in…";
    }

    login(username);
    window.location.replace("/admin");
  });

  syncThemeButton();
  syncPasswordToggle();
  refreshIcons();
}
