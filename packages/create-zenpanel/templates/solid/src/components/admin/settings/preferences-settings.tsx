import { SettingsCard } from "@/components/admin/settings/settings-card";
import { useTheme } from "@/components/theme/theme-provider";
import { useAdminToast } from "@/lib/admin-toast";
import { cn } from "@/lib/cn";
import { NOTIFICATIONS, readNotificationPrefs, writeNotificationPrefs, type NotificationId } from "@/lib/preferences";
import { Monitor, Moon, Sun } from "lucide-solid";
import { createSignal, For } from "solid-js";
import { Dynamic } from "solid-js/web";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

/** Theme picker and email notification switches (stored on this device). */
export function PreferencesSettings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useAdminToast();
  const [prefs, setPrefs] = createSignal(readNotificationPrefs());

  function toggle(id: NotificationId) {
    const next = { ...prefs(), [id]: !prefs()[id] };
    setPrefs(next);
    writeNotificationPrefs(next);
    const item = NOTIFICATIONS.find((n) => n.id === id)!;
    toast({ variant: "info", title: `${item.label} ${next[id] ? "on" : "off"}`, duration: 2500 });
  }

  return (
    <div class="space-y-6">
      <SettingsCard title="Appearance" description="Choose how the admin panel looks on this device.">
        <div role="radiogroup" aria-label="Theme" class="grid grid-cols-3 gap-3 sm:max-w-md">
          <For each={themes}>
            {(t) => (
              <button
                type="button"
                role="radio"
                aria-checked={theme() === t.value}
                class={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors",
                  theme() === t.value
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5",
                )}
                onClick={() => setTheme(t.value)}
              >
                <Dynamic component={t.icon} class="h-5 w-5" aria-hidden />
                {t.label}
              </button>
            )}
          </For>
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications" description="Pick which emails you want to receive.">
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <For each={NOTIFICATIONS}>
            {(n) => (
              <li class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div class="min-w-0">
                  <p id={`notify-${n.id}`} class="text-sm font-medium text-gray-900 dark:text-white">
                    {n.label}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{n.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs()[n.id]}
                  aria-labelledby={`notify-${n.id}`}
                  class="admin-switch"
                  onClick={() => toggle(n.id)}
                />
              </li>
            )}
          </For>
        </ul>
      </SettingsCard>
    </div>
  );
}
