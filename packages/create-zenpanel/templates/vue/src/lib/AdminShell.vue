<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { adminConfig, adminNavItems } from "./config";
import { getAdmin, logout, type AdminSession } from "./auth";
import { getTheme, initTheme, toggleTheme } from "./theme";
import { navigate, normalizePath } from "./router";
import { refreshIcons } from "./icons";

const props = defineProps<{
  pageTitle: string;
}>();

const SIDEBAR_KEY = "zenpanel-sidebar-expanded";
const { brand } = adminConfig;

const admin = ref<AdminSession | null>(null);
const expanded = ref(true);
const mobileOpen = ref(false);
const themeDark = ref(false);
const desktop = ref(false);

function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function isActive(href: string) {
  const path = normalizePath(window.location.pathname);
  if (href === "/admin") return path === "/admin";
  return path === href;
}

const sidebarWidth = computed(() => {
  if (!desktop.value) return 0;
  return expanded.value ? 260 : 80;
});

const showLabels = computed(
  () => !desktop.value || expanded.value || mobileOpen.value,
);

const sidebarVisible = computed(() => mobileOpen.value || desktop.value);

function go(path: string) {
  return (e: MouseEvent) => {
    e.preventDefault();
    mobileOpen.value = false;
    navigate(path);
  };
}

async function onToggleTheme() {
  toggleTheme();
  themeDark.value = getTheme() === "dark";
  await nextTick();
  refreshIcons();
}

function onToggleSidebar() {
  expanded.value = !expanded.value;
  try {
    localStorage.setItem(SIDEBAR_KEY, expanded.value ? "1" : "0");
  } catch {
    // ignore
  }
}

function onLogout() {
  logout();
  navigate("/admin/login", { replace: true });
}

let mq: MediaQueryList | null = null;
function onMqChange() {
  if (!mq) return;
  desktop.value = mq.matches;
  mobileOpen.value = false;
}

onMounted(async () => {
  initTheme();
  const session = getAdmin();
  if (!session) {
    navigate("/admin/login", { replace: true });
    return;
  }
  admin.value = session;
  themeDark.value = getTheme() === "dark";
  desktop.value = isDesktop();

  try {
    expanded.value = localStorage.getItem(SIDEBAR_KEY) !== "0";
  } catch {
    expanded.value = true;
  }

  mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onMqChange);

  await nextTick();
  refreshIcons();
});

onUnmounted(() => {
  mq?.removeEventListener("change", onMqChange);
});

watch(
  () => [expanded.value, mobileOpen.value, themeDark.value, props.pageTitle],
  async () => {
    await nextTick();
    refreshIcons();
  },
);
</script>

<template>
  <div v-if="admin" class="admin-main">
    <div
      class="admin-sidebar-spacer"
      :style="{ width: `${sidebarWidth}px` }"
      aria-hidden="true"
    ></div>
    <aside
      class="admin-sidebar"
      :class="{
        collapsed: !expanded,
        'mobile-closed': !sidebarVisible,
      }"
      aria-label="Admin navigation"
      :aria-hidden="sidebarVisible ? 'false' : 'true'"
      :inert="!sidebarVisible ? true : undefined"
    >
      <div class="admin-topbar">
        <a
          href="/admin"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            minWidth: 0,
            flex: 1,
            justifyContent: showLabels ? undefined : 'center',
          }"
          @click="go('/admin')"
        >
          <span class="brand-mark">{{ brand.letter }}</span>
          <div v-if="showLabels" class="brand-text" style="min-width: 0">
            <div style="font-weight: 600; font-size: 15px">{{ brand.name }}</div>
            <div class="muted" style="font-size: 12px">{{ brand.tagline }}</div>
          </div>
        </a>
        <button
          v-if="!desktop"
          type="button"
          class="icon-btn"
          aria-label="Close menu"
          @click="mobileOpen = false"
        >
          <i data-lucide="x" style="width: 22px; height: 22px; flex-shrink: 0"></i>
        </button>
      </div>
      <nav class="nav-list">
        <p v-if="showLabels" class="nav-label">Menu</p>
        <a
          v-for="item in adminNavItems"
          :key="item.href"
          class="nav-link"
          :class="{ active: isActive(item.href) }"
          :href="item.href"
          :title="item.name"
          @click="go(item.href)"
        >
          <i
            :data-lucide="item.icon"
            style="width: 22px; height: 22px; flex-shrink: 0"
          ></i>
          <span v-if="showLabels" class="nav-text">{{ item.name }}</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <a
          class="nav-link"
          :href="brand.siteUrl || '/'"
          @click="go(brand.siteUrl || '/')"
        >
          <i
            data-lucide="external-link"
            style="width: 22px; height: 22px; flex-shrink: 0"
          ></i>
          <span v-if="showLabels" class="nav-text">View site</span>
        </a>
        <button
          v-if="desktop"
          type="button"
          class="btn btn-ghost"
          :style="{
            width: '100%',
            justifyContent: showLabels ? 'flex-start' : 'center',
            gap: '0.75rem',
          }"
          @click="onToggleSidebar"
        >
          <template v-if="expanded">
            <i
              data-lucide="chevron-left"
              style="width: 22px; height: 22px; flex-shrink: 0"
            ></i>
            <span>Collapse</span>
          </template>
          <i
            v-else
            data-lucide="chevron-right"
            style="width: 22px; height: 22px; flex-shrink: 0"
          ></i>
        </button>
      </div>
    </aside>
    <button
      type="button"
      class="backdrop"
      aria-label="Close menu"
      :hidden="!(mobileOpen && !desktop)"
      @click="mobileOpen = false"
    ></button>
    <div class="admin-content-wrap">
      <header class="admin-header">
        <div style="display: flex; align-items: center; gap: 0.75rem">
          <button
            type="button"
            class="icon-btn hidden-desktop"
            aria-label="Open menu"
            @click="mobileOpen = true"
          >
            <i
              data-lucide="menu"
              style="width: 22px; height: 22px; flex-shrink: 0"
            ></i>
          </button>
          <strong style="font-size: 0.95rem">{{ pageTitle }}</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button
            type="button"
            class="icon-btn"
            :aria-label="
              themeDark ? 'Switch to light mode' : 'Switch to dark mode'
            "
            @click="onToggleTheme"
          >
            <i
              :data-lucide="themeDark ? 'sun' : 'moon'"
              style="width: 22px; height: 22px; flex-shrink: 0"
            ></i>
          </button>
          <div class="user-chip">
            <span class="user-avatar">{{
              (admin.username || "A").charAt(0).toUpperCase()
            }}</span>
            <div
              class="only-desktop"
              style="
                flex-direction: column;
                align-items: flex-start;
                line-height: 1.2;
              "
            >
              <span style="font-size: 0.875rem; font-weight: 500">{{
                admin.username
              }}</span>
              <span class="muted" style="font-size: 0.75rem">{{
                admin.email
              }}</span>
            </div>
            <button
              type="button"
              class="btn btn-ghost"
              style="height: 2rem; padding: 0 0.75rem"
              @click="onLogout"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main class="admin-main-scroll">
        <slot />
      </main>
    </div>
  </div>
</template>
