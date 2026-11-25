import { DEMO_PASSWORD, DEMO_USERNAME, adminConfig } from "./config.js";
import { login, requireGuest } from "./auth.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";
import { escapeHtml, refreshIcons } from "./utils.js";
import { firstError, validateLogin } from "./lib/admin-forms.js";
import { setDocumentTitle } from "./lib/preferences.js";

initTheme();
setDocumentTitle("Sign in");

if (!requireGuest()) {
  // Already signed in - redirect in progress.
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
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-200" aria-hidden="true">✓</span>
          ${escapeHtml(f)}
        </li>
      `,
      )
      .join("");
  }

  // Preview only. Do not prefill username or password in production.
  if (usernameInput) usernameInput.value = DEMO_USERNAME;
  if (passwordInput) passwordInput.value = DEMO_PASSWORD;

  let showPassword = false;

  const errorInputClass = ["border-error-500", "focus:border-error-500", "focus:ring-error-500/20", "dark:border-error-500"];
  form?.setAttribute("novalidate", "");

  /** Inline field errors (`#admin-username-error`, `#admin-password-error`). */
  function setFieldError(input, message) {
    if (!input) return;
    const id = `${input.id}-error`;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      el.className = "mt-1.5 text-sm text-error-500";
      input.closest(".relative")?.after(el);
    }
    el.textContent = message ?? "";
    el.hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) input.setAttribute("aria-describedby", id);
    else input.removeAttribute("aria-describedby");
    errorInputClass.forEach((c) => input.classList.toggle(c, Boolean(message)));
  }

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

    const username = usernameInput?.value.trim() ?? "";
    const password = passwordInput?.value ?? "";
    const errors = validateLogin(username, password);
    setFieldError(usernameInput, errors.username);
    setFieldError(passwordInput, errors.password);
    const first = firstError(["username", "password"], errors);
    if (first) {
      document.getElementById(`admin-${first}`)?.focus();
      return;
    }

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
