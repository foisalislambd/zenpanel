<script lang="ts">
  import { onMount } from "svelte";
  import { getAdmin } from "./lib/auth";
  import {
    matchRoute,
    normalizePath,
    type MatchedRoute,
  } from "./lib/router";
  import HomePage from "./routes/HomePage.svelte";
  import LoginPage from "./routes/LoginPage.svelte";
  import DashboardPage from "./routes/DashboardPage.svelte";
  import SettingsPage from "./routes/SettingsPage.svelte";
  import ResourcePage from "./routes/ResourcePage.svelte";
  import AdminShell from "./lib/AdminShell.svelte";

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
    route = next;
    document.body.classList.toggle("admin-shell", next.id !== "home");

    const titles: Record<string, string> = {
      home: "ZenPanel — Svelte",
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

  let route = $state<MatchedRoute>(resolveRoute());

  onMount(() => {
    const onPop = () => syncRoute();
    window.addEventListener("popstate", onPop);
    syncRoute();
    return () => window.removeEventListener("popstate", onPop);
  });
</script>

{#if route.id === "home"}
  <HomePage />
{:else if route.id === "login"}
  <LoginPage />
{:else if route.id === "dashboard"}
  <AdminShell pageTitle="Dashboard">
    <DashboardPage />
  </AdminShell>
{:else if route.id === "settings"}
  <AdminShell pageTitle="Settings">
    <SettingsPage />
  </AdminShell>
{:else if route.id === "resource"}
  <AdminShell pageTitle={route.title}>
    <ResourcePage resourceKey={route.key} title={route.title} />
  </AdminShell>
{/if}
