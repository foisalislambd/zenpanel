<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useRouter } from "vue-router";
import { ChevronDown, LogOut, Settings, SlidersHorizontal } from "lucide-vue-next";
import { useAdminAuth } from "@/composables/use-admin-auth";
import { activateMenu } from "@/lib/dialog";

const auth = useAdminAuth();
const router = useRouter();

const open = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);
const menuId = useId();
let release: (() => void) | null = null;

function handleClick(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) open.value = false;
}

watch(open, async (isOpen) => {
  release?.();
  release = null;
  if (!isOpen) return;
  await nextTick();
  if (menuRef.value) {
    release = activateMenu(menuRef.value, (restoreFocus) => {
      open.value = false;
      if (restoreFocus) triggerRef.value?.focus();
    });
  }
});

onMounted(() => document.addEventListener("mousedown", handleClick));
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClick);
  release?.();
});

function handleLogout() {
  open.value = false;
  auth.logout();
  void router.replace("/admin/login");
}

const itemClass =
  "flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5";
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      class="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pr-2 pl-1 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-controls="open ? menuId : undefined"
      :aria-label="`Account menu for ${auth.admin?.username ?? 'admin'}`"
      @click="open = !open"
    >
      <span class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-semibold text-white">
        {{ auth.admin?.username?.charAt(0)?.toUpperCase() ?? "A" }}
      </span>
      <span class="hidden min-w-0 text-left md:block">
        <span class="block truncate text-sm font-medium text-gray-900 dark:text-white">
          {{ auth.admin?.username ?? "admin" }}
        </span>
      </span>
      <ChevronDown
        :class="['hidden h-4 w-4 shrink-0 text-gray-500 transition md:block', open ? 'rotate-180' : '']"
        aria-hidden="true"
      />
    </button>

    <div
      v-if="open"
      :id="menuId"
      ref="menuRef"
      role="menu"
      aria-label="Account"
      class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ auth.admin?.username }}</p>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ auth.admin?.email }}</p>
      </div>
      <RouterLink to="/admin/settings" role="menuitem" :class="itemClass" @click="open = false">
        <Settings class="h-4 w-4" aria-hidden="true" />
        Account settings
      </RouterLink>
      <RouterLink to="/admin/settings?tab=preferences" role="menuitem" :class="itemClass" @click="open = false">
        <SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
        Preferences
      </RouterLink>
      <div class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator" />
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </div>
  </div>
</template>
