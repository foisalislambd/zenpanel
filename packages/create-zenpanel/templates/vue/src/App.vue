<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { getAdmin } from "./lib/auth";
import {
  matchRoute,
  normalizePath,
  type MatchedRoute,
} from "./lib/router";
import HomePage from "./routes/HomePage.vue";
import LoginPage from "./routes/LoginPage.vue";
import DashboardPage from "./routes/DashboardPage.vue";
import SettingsPage from "./routes/SettingsPage.vue";
import ResourcePage from "./routes/ResourcePage.vue";
import AdminShell from "./lib/AdminShell.vue";

/** Resolve unknown /admin/* without depending on a popstate listener. */
function resolveRoute(): MatchedRoute {
  let next = matchRoute();
  if (next.id !== "admin-unknown") return next;

  const target = getAdmin() ? "/admin" : "/admin/login";
  if (normalizePath(window.location.pathname) !== normalizePath(target)) {
    window.history.replaceState({}, "", target);
  }
  return matchRoute();
}

function applyRoute(next: MatchedRoute) {
  route.value = next;
  document.body.classList.toggle("admin-shell", next.id !== "home");

  const titles: Record<string, string> = {
    home: "ZenPanel — Vue",
    login: "Sign in — ZenPanel",
    dashboard: "Dashboard — ZenPanel",
    settings: "Settings — ZenPanel",
  };
  if (next.id === "resource") {
    document.title = `${next.title} — ZenPanel`;
  } else {
    document.title = titles[next.id] ?? "ZenPanel";
  }
}

function syncRoute() {
  applyRoute(resolveRoute());
}

const route = ref<MatchedRoute>(resolveRoute());

onMounted(() => {
  window.addEventListener("popstate", syncRoute);
  syncRoute();
});

onUnmounted(() => {
  window.removeEventListener("popstate", syncRoute);
});
</script>

<template>
  <HomePage v-if="route.id === 'home'" />
  <LoginPage v-else-if="route.id === 'login'" />
  <AdminShell v-else-if="route.id === 'dashboard'" page-title="Dashboard">
    <DashboardPage />
  </AdminShell>
  <AdminShell v-else-if="route.id === 'settings'" page-title="Settings">
    <SettingsPage />
  </AdminShell>
  <AdminShell
    v-else-if="route.id === 'resource'"
    :page-title="route.title"
  >
    <ResourcePage :resource-key="route.key" :title="route.title" />
  </AdminShell>
</template>
