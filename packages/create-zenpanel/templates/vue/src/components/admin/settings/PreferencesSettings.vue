<script setup lang="ts">
import { ref } from "vue";
import { Monitor, Moon, Sun } from "lucide-vue-next";
import SettingsCard from "@/components/admin/settings/SettingsCard.vue";
import { useAdminToast } from "@/composables/use-admin-toast";
import { useTheme } from "@/composables/use-theme";
import { cn } from "@/lib/cn";
import {
  NOTIFICATIONS,
  readNotificationPrefs,
  writeNotificationPrefs,
  type NotificationId,
} from "@/lib/preferences";

const theme = useTheme();
const { toast } = useAdminToast();
const prefs = ref(readNotificationPrefs());

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function toggle(id: NotificationId) {
  const next = { ...prefs.value, [id]: !prefs.value[id] };
  prefs.value = next;
  writeNotificationPrefs(next);
  const item = NOTIFICATIONS.find((n) => n.id === id)!;
  toast({ variant: "info", title: `${item.label} ${next[id] ? "on" : "off"}`, duration: 2500 });
}
</script>

<template>
  <div class="space-y-6">
    <SettingsCard title="Appearance" description="Choose how the admin panel looks on this device.">
      <div role="radiogroup" aria-label="Theme" class="grid grid-cols-3 gap-3 sm:max-w-md">
        <button
          v-for="t in themes"
          :key="t.value"
          type="button"
          role="radio"
          :aria-checked="theme.theme === t.value"
          :class="
            cn(
              'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors',
              theme.theme === t.value
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5',
            )
          "
          @click="theme.setTheme(t.value)"
        >
          <component :is="t.icon" class="h-5 w-5" aria-hidden="true" />
          {{ t.label }}
        </button>
      </div>
    </SettingsCard>

    <SettingsCard title="Notifications" description="Pick which emails you want to receive.">
      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        <li v-for="n in NOTIFICATIONS" :key="n.id" class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div class="min-w-0">
            <p :id="`notify-${n.id}`" class="text-sm font-medium text-gray-900 dark:text-white">{{ n.label }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ n.description }}</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="prefs[n.id]"
            :aria-labelledby="`notify-${n.id}`"
            class="admin-switch"
            @click="toggle(n.id)"
          />
        </li>
      </ul>
    </SettingsCard>
  </div>
</template>
