/** Notification preferences (preview: persisted in localStorage). */
export const NOTIFY_KEY = "zenpanel-notifications";

export const NOTIFICATIONS = [
  { id: "orders", label: "New orders", description: "Email me when a customer places an order." },
  { id: "messages", label: "Customer messages", description: "Notify me about new inbox conversations." },
  { id: "weekly", label: "Weekly summary", description: "A Monday digest of revenue, users and activity." },
  { id: "security", label: "Security alerts", description: "Sign-ins from new devices and password changes." },
] as const;

export type NotificationId = (typeof NOTIFICATIONS)[number]["id"];
export type NotificationPrefs = Record<NotificationId, boolean>;

const DEFAULTS: NotificationPrefs = { orders: true, messages: true, weekly: false, security: true };

export function readNotificationPrefs(): NotificationPrefs {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(NOTIFY_KEY) ?? "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeNotificationPrefs(prefs: NotificationPrefs) {
  try {
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(prefs));
  } catch {
    // ignore private-mode storage errors
  }
}

export const SETTINGS_TABS = [
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
  { id: "branding", label: "Branding" },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export function parseSettingsTab(value: string | null | undefined): SettingsTabId {
  return SETTINGS_TABS.some((t) => t.id === value) ? (value as SettingsTabId) : "account";
}

export function setDocumentTitle(title?: string) {
  if (title) document.title = `${title} · ZenPanel`;
}
