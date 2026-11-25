// Generated from the shared ZenPanel TypeScript core - edit freely.
const NOTIFY_KEY = "zenpanel-notifications";
const NOTIFICATIONS = [
  { id: "orders", label: "New orders", description: "Email me when a customer places an order." },
  { id: "messages", label: "Customer messages", description: "Notify me about new inbox conversations." },
  { id: "weekly", label: "Weekly summary", description: "A Monday digest of revenue, users and activity." },
  { id: "security", label: "Security alerts", description: "Sign-ins from new devices and password changes." }
];
const DEFAULTS = { orders: true, messages: true, weekly: false, security: true };
function readNotificationPrefs() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(NOTIFY_KEY) ?? "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}
function writeNotificationPrefs(prefs) {
  try {
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(prefs));
  } catch {
  }
}
const SETTINGS_TABS = [
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
  { id: "branding", label: "Branding" }
];
function parseSettingsTab(value) {
  return SETTINGS_TABS.some((t) => t.id === value) ? value : "account";
}
function setDocumentTitle(title) {
  if (title) document.title = `${title} \xB7 ZenPanel`;
}
export {
  NOTIFICATIONS,
  NOTIFY_KEY,
  SETTINGS_TABS,
  parseSettingsTab,
  readNotificationPrefs,
  setDocumentTitle,
  writeNotificationPrefs
};
