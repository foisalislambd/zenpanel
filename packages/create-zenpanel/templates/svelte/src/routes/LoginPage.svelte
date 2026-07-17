<script lang="ts">
  import { onMount, tick } from "svelte";
  import {
    DEMO_PASSWORD,
    DEMO_USERNAME,
    adminConfig,
  } from "../lib/config";
  import { getAdmin, login } from "../lib/auth";
  import { getTheme, initTheme, toggleTheme } from "../lib/theme";
  import { navigate } from "../lib/router";
  import { refreshIcons } from "../lib/icons";

  const { brand } = adminConfig;

  let error = $state("");
  let themeIcon = $state<"sun" | "moon">("moon");
  let username = $state(DEMO_USERNAME);
  let password = $state(DEMO_PASSWORD);

  function syncThemeIcon() {
    themeIcon = getTheme() === "dark" ? "sun" : "moon";
  }

  async function onToggleTheme() {
    toggleTheme();
    syncThemeIcon();
    await tick();
    refreshIcons();
  }

  function goHome(e: MouseEvent) {
    e.preventDefault();
    navigate("/");
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    error = "";
    const user = username.trim() || DEMO_USERNAME;
    if (password !== DEMO_PASSWORD) {
      error = "Invalid credentials. Use admin / admin for the preview.";
      return;
    }
    login(user);
    navigate("/admin", { replace: true });
  }

  onMount(async () => {
    initTheme();
    if (getAdmin()) {
      navigate("/admin", { replace: true });
      return;
    }
    syncThemeIcon();
    await tick();
    refreshIcons();
  });
</script>

<div class="login-page">
  <button
    type="button"
    class="icon-btn"
    style="position:absolute;top:1rem;right:1rem;z-index:10"
    aria-label={themeIcon === "sun" ? "Switch to light mode" : "Switch to dark mode"}
    onclick={onToggleTheme}
  >
    <i data-lucide={themeIcon} style="width:20px;height:20px"></i>
  </button>

  <div class="login-form-wrap">
    <div class="login-form">
      <a href="/" class="muted" style="font-size:0.875rem;font-weight:500" onclick={goHome}
        >← Back to site</a
      >
      <div style="margin-top:2rem">
        <div class="brand-mark" style="margin-bottom:1.5rem">{brand.letter}</div>
        <h1 style="margin:0;font-size:1.75rem;font-weight:600">Sign in</h1>
        <p class="muted" style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.5">
          Preview UI — credentials are prefilled. Click sign in to open the dashboard.
        </p>
      </div>
      <form style="margin-top:2rem" onsubmit={onSubmit}>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" name="username" autocomplete="username" bind:value={username} />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            bind:value={password}
          />
        </div>
        {#if error}
          <p class="error-text">{error}</p>
        {/if}
        <button class="btn btn-primary" style="width:100%" type="submit">
          Sign in to dashboard
        </button>
      </form>
      <p class="muted" style="margin-top:2rem;text-align:center;font-size:0.75rem">
        UI preview only — no real authentication.
      </p>
    </div>
  </div>

  <aside class="login-brand-panel">
    <div style="position:relative;z-index:1;max-width:28rem">
      <div
        class="brand-mark"
        style="margin:0 auto;height:4rem;width:4rem;font-size:1.5rem;border-radius:1rem"
      >
        {brand.letter}
      </div>
      <h2 style="margin:1.5rem 0 0.75rem;font-size:1.75rem">{brand.name}</h2>
      <p style="margin:0;color:rgba(236,243,255,0.9);line-height:1.6">
        {brand.loginDescription}
      </p>
      <ul
        style="list-style:none;padding:0;margin:2rem 0 0;text-align:left;color:rgba(236,243,255,0.85)"
      >
        {#each brand.loginFeatures as feature}
          <li style="display:flex;gap:0.75rem;align-items:center;margin:0.75rem 0">
            <span
              style="display:inline-flex;height:1.25rem;width:1.25rem;align-items:center;justify-content:center;border-radius:999px;background:rgba(70,95,255,0.3);font-size:12px"
              >✓</span
            >
            {feature}
          </li>
        {/each}
      </ul>
    </div>
  </aside>
</div>
