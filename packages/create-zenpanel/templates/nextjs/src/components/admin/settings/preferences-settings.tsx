"use client";

import { SettingsCard } from "@/components/admin/settings/account-settings";
import { useAdminToast } from "@/components/admin/ui/admin-toast-provider";
import { cn } from "@/lib/cn";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useStoredValue } from "@/hooks/use-stored-value";
import { useMemo } from "react";

const NOTIFY_KEY = "zenpanel-notifications";

const NOTIFICATIONS = [
  { id: "orders", label: "New orders", description: "Email me when a customer places an order." },
  { id: "messages", label: "Customer messages", description: "Notify me about new inbox conversations." },
  { id: "weekly", label: "Weekly summary", description: "A Monday digest of revenue, users and activity." },
  { id: "security", label: "Security alerts", description: "Sign-ins from new devices and password changes." },
] as const;

type NotificationId = (typeof NOTIFICATIONS)[number]["id"];

const DEFAULT_NOTIFICATIONS: Record<NotificationId, boolean> = {
  orders: true,
  messages: true,
  weekly: false,
  security: true,
};

function parseNotifications(raw: string | null): Record<NotificationId, boolean> {
  try {
    return { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(raw ?? "{}") };
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function PreferencesSettings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useAdminToast();
  const [stored, setStored] = useStoredValue(NOTIFY_KEY);
  const prefs = useMemo(() => parseNotifications(stored), [stored]);

  function toggle(id: NotificationId) {
    const next = { ...prefs, [id]: !prefs[id] };
    setStored(JSON.stringify(next));
    const item = NOTIFICATIONS.find((n) => n.id === id)!;
    toast({ variant: "info", title: `${item.label} ${next[id] ? "on" : "off"}`, duration: 2500 });
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      <SettingsCard title="Appearance" description="Choose how the admin panel looks on this device.">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-3 sm:max-w-md">
          {themes.map((t) => {
            const selected = (theme ?? "system") === t.value;
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors",
                  selected
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications" description="Pick which emails you want to receive.">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p id={`notify-${n.id}`} className="text-sm font-medium text-gray-900 dark:text-white">
                  {n.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{n.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[n.id]}
                aria-labelledby={`notify-${n.id}`}
                onClick={() => toggle(n.id)}
                className="admin-switch"
              />
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  );
}
