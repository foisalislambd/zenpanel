/** Settings with URL-synced tabs (`?tab=security`), arrow-key navigation and validated forms. */
import { getAdmin, updateProfile } from "./auth.js";
import { CONFIG_FILE, STYLES_FILE } from "./config.js";
import { validateAccount, validatePassword } from "./lib/admin-forms.js";
import { nextTabIndex } from "./lib/dialog.js";
import {
  NOTIFICATIONS,
  SETTINGS_TABS,
  parseSettingsTab,
  readNotificationPrefs,
  writeNotificationPrefs,
} from "./lib/preferences.js";
import { getThemePreference, setThemePreference } from "./theme.js";
import { applyFieldErrors, formField, inputClass, toast } from "./ui.js";
import { escapeHtml, icon, navSectionFor, pageHeader, refreshIcons } from "./utils.js";

function card({ title, description, body, footer = "", form = false }) {
  const tag = form ? "form" : "div";
  return `
    <${tag} ${form ? "novalidate" : ""} class="admin-card block overflow-hidden">
      <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${escapeHtml(description)}</p>
        </div>
        <div class="min-w-0 space-y-4">${body}</div>
      </div>
      ${footer ? `<div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 md:px-6 dark:border-gray-800 dark:bg-white/[0.02]">${footer}</div>` : ""}
    </${tag}>`;
}

function accountPanel(panel) {
  const admin = getAdmin() ?? {};
  const input = (key, attrs) => `<input id="settings-${key}" ${attrs} class="${inputClass}" />`;
  panel.innerHTML = `<div class="space-y-6">${card({
    title: "Profile",
    description: "How you appear across the admin panel.",
    form: true,
    body: `
      <div class="grid gap-4 sm:grid-cols-2">
        ${formField({ id: "settings-username", label: "Username", required: true, control: input("username", `autocomplete="username" value="${escapeHtml(admin.username ?? "")}"`) })}
        ${formField({ id: "settings-email", label: "Email", required: true, control: input("email", `type="email" autocomplete="email" value="${escapeHtml(admin.email ?? "")}"`) })}
      </div>
      <dl class="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
        <div><dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt><dd class="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">${escapeHtml(admin.role ?? "-")}</dd></div>
        <div><dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt><dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${escapeHtml(admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "-")}</dd></div>
      </dl>`,
    footer: `
      <button type="button" data-reset disabled class="admin-btn admin-btn-secondary">Reset</button>
      <button type="submit" disabled class="admin-btn admin-btn-primary">Save changes</button>`,
  })}</div>`;
  const form = panel.querySelector("form");
  const u = form.querySelector("#settings-username");
  const m = form.querySelector("#settings-email");
  const buttons = form.querySelectorAll("[data-reset],[type=submit]");
  const sync = () => {
    const a = getAdmin() ?? {};
    const dirty = u.value !== (a.username ?? "") || m.value !== (a.email ?? "");
    buttons.forEach((b) => (b.disabled = !dirty));
  };
  form.addEventListener("input", sync);
  form.querySelector("[data-reset]").addEventListener("click", () => {
    const a = getAdmin() ?? {};
    u.value = a.username ?? "";
    m.value = a.email ?? "";
    applyFieldErrors(form, "settings", {}, ["username", "email"]);
    sync();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = validateAccount(u.value, m.value);
    if (!applyFieldErrors(form, "settings", errors, ["username", "email"])) return;
    updateProfile({ username: u.value.trim(), email: m.value.trim() });
    toast({ title: "Profile updated", description: "Your account details were saved." });
    sync();
  });
}

function securityPanel(panel) {
  const fields = [
    ["current", "Current password", "", "sm:col-span-2"],
    ["next", "New password", "At least 8 characters with a letter and a number.", ""],
    ["confirm", "Confirm new password", "", ""],
  ];
  panel.innerHTML = card({
    title: "Password",
    description: "Choose a strong password you don't use elsewhere.",
    form: true,
    body: `
      <div class="grid gap-4 sm:grid-cols-2">
        ${fields
          .map(([key, label, hint, cls]) =>
            formField({
              id: `security-${key}`,
              label,
              hint,
              required: true,
              className: cls,
              control: `<input id="security-${key}" type="password" autocomplete="${key === "current" ? "current-password" : "new-password"}" ${hint ? `aria-describedby="security-${key}-hint"` : ""} class="${inputClass}" />`,
            }),
          )
          .join("")}
      </div>
      <button type="button" data-toggle-show class="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"></button>`,
    footer: '<button type="submit" class="admin-btn admin-btn-primary">Update password</button>',
  });
  const form = panel.querySelector("form");
  const toggle = form.querySelector("[data-toggle-show]");
  let show = false;
  const paintToggle = () => {
    toggle.innerHTML = `${icon(show ? "eye-off" : "eye", "h-4 w-4")} ${show ? "Hide passwords" : "Show passwords"}`;
    form.querySelectorAll('input[id^="security-"]').forEach((i) => (i.type = show ? "text" : "password"));
    refreshIcons();
  };
  toggle.addEventListener("click", () => {
    show = !show;
    paintToggle();
  });
  paintToggle();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (k) => form.querySelector(`#security-${k}`).value;
    const errors = validatePassword(v("current"), v("next"), v("confirm"));
    if (!applyFieldErrors(form, "security", errors, ["current", "next", "confirm"])) return;
    form.reset();
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  });
}

function preferencesPanel(panel, onThemeChange) {
  const themes = [
    ["light", "Light", "sun"],
    ["dark", "Dark", "moon"],
    ["system", "System", "monitor"],
  ];
  let prefs = readNotificationPrefs();
  function paint() {
    const current = getThemePreference();
    panel.innerHTML = `<div class="space-y-6">
      ${card({
        title: "Appearance",
        description: "Choose how the admin panel looks on this device.",
        body: `<div role="radiogroup" aria-label="Theme" class="grid grid-cols-3 gap-3 sm:max-w-md">
          ${themes
            .map(
              ([value, label, iconName]) => `
            <button type="button" role="radio" data-theme="${value}" aria-checked="${current === value}"
              class="flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors ${
                current === value
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              }">${icon(iconName, "h-5 w-5")}${label}</button>`,
            )
            .join("")}
        </div>`,
      })}
      ${card({
        title: "Notifications",
        description: "Pick which emails you want to receive.",
        body: `<ul class="divide-y divide-gray-100 dark:divide-gray-800">
          ${NOTIFICATIONS.map(
            (n) => `
            <li class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0">
                <p id="notify-${n.id}" class="text-sm font-medium text-gray-900 dark:text-white">${escapeHtml(n.label)}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(n.description)}</p>
              </div>
              <button type="button" role="switch" data-notify="${n.id}" aria-checked="${Boolean(prefs[n.id])}" aria-labelledby="notify-${n.id}" class="admin-switch"></button>
            </li>`,
          ).join("")}
        </ul>`,
      })}
    </div>`;
    refreshIcons();
  }
  panel.addEventListener("click", (e) => {
    const theme = e.target.closest("[data-theme]");
    if (theme) {
      setThemePreference(theme.dataset.theme);
      onThemeChange?.();
      paint();
      panel.querySelector(`[data-theme="${theme.dataset.theme}"]`)?.focus();
      return;
    }
    const sw = e.target.closest("[data-notify]");
    if (sw) {
      const id = sw.dataset.notify;
      prefs = { ...prefs, [id]: !prefs[id] };
      writeNotificationPrefs(prefs);
      sw.setAttribute("aria-checked", String(prefs[id]));
      const item = NOTIFICATIONS.find((n) => n.id === id);
      toast({ variant: "info", title: `${item.label} ${prefs[id] ? "on" : "off"}`, duration: 2500 });
    }
  });
  paint();
}

function brandingPanel(panel) {
  panel.innerHTML = card({
    title: "Branding & navigation",
    description: "Panel name, logo letter, sidebar links and login copy.",
    body: `<p class="text-sm text-gray-600 dark:text-gray-300">
      Edit <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">${escapeHtml(CONFIG_FILE)}</code>
      to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in
      <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">${escapeHtml(STYLES_FILE)}</code>
      (<code class="text-xs">--color-brand-*</code>).
    </p>`,
  });
}

/**
 * @param {HTMLElement} root
 * @param {{ onThemeChange?: () => void }} [options]
 */
export function renderSettingsPage(root, options = {}) {
  if (!root) return;
  const renderers = { account: accountPanel, security: securityPanel, preferences: preferencesPanel, branding: brandingPanel };
  const params = new URLSearchParams(window.location.search);
  let active = parseSettingsTab(params.get("tab"));

  root.innerHTML = `
    <div class="admin-content space-y-6">
      ${pageHeader("Settings", "", navSectionFor("Settings"))}
      <div role="tablist" aria-label="Settings sections" class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800">
        ${SETTINGS_TABS.map(
          (t) => `<button type="button" role="tab" id="settings-tab-${t.id}" data-tab="${t.id}" aria-controls="settings-panel-${t.id}"
            class="-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors">${escapeHtml(t.label)}</button>`,
        ).join("")}
      </div>
      ${SETTINGS_TABS.map(
        (t) => `<div role="tabpanel" id="settings-panel-${t.id}" aria-labelledby="settings-tab-${t.id}" tabindex="0" class="focus:outline-none" hidden></div>`,
      ).join("")}
    </div>`;

  const tablist = root.querySelector('[role="tablist"]');

  function select(id, focus = false) {
    active = id;
    const url = new URL(window.location.href);
    if (id === "account") url.searchParams.delete("tab");
    else url.searchParams.set("tab", id);
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    SETTINGS_TABS.forEach((t) => {
      const tab = root.querySelector(`#settings-tab-${t.id}`);
      const panel = root.querySelector(`#settings-panel-${t.id}`);
      const on = t.id === id;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      tab.className = `-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
        on
          ? "border-brand-500 text-brand-600 dark:text-brand-400"
          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      }`;
      panel.hidden = !on;
      if (on) renderers[t.id](panel, options.onThemeChange);
      else panel.innerHTML = "";
    });
    refreshIcons();
    if (focus) root.querySelector(`#settings-tab-${id}`)?.focus();
  }

  tablist.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (tab) select(tab.dataset.tab);
  });
  tablist.addEventListener("keydown", (e) => {
    const index = SETTINGS_TABS.findIndex((t) => t.id === active);
    const next = nextTabIndex(e.key, index, SETTINGS_TABS.length);
    if (next >= 0) {
      e.preventDefault();
      select(SETTINGS_TABS[next].id, true);
    }
  });

  select(active);
}
