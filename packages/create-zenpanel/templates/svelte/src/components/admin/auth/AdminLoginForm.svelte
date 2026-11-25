<script lang="ts">
  import { useAdminAuth } from "@/context/admin-auth-context.svelte";
  import { adminConfig } from "@/config/admin.config";
  import { firstError, validateLogin, type FieldErrors } from "@/lib/admin-forms";
  import { isExternalUrl } from "@/lib/admin-nav";
  import { navigate } from "@/lib/router.svelte";
  import { ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  // Preview only. Do not prefill username or password in production.
  const DEMO_USERNAME = "admin";
  const DEMO_PASSWORD = "admin";

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  const errorInputClass = "border-error-500 focus:border-error-500 focus:ring-error-500/20 dark:border-error-500";

  const backLinkClass =
    "inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200";

  const auth = useAdminAuth();
  let username = $state(DEMO_USERNAME);
  let password = $state(DEMO_PASSWORD);
  let showPassword = $state(false);
  let submitting = $state(false);
  let error = $state<string | null>(null);
  let fieldErrors = $state<FieldErrors<"username" | "password">>({});

  const siteUrl = adminConfig.brand.siteUrl || "/";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = null;
    const next = validateLogin(username, password);
    fieldErrors = next;
    const first = firstError(["username", "password"] as const, next);
    if (first) {
      document.getElementById(`admin-${first}`)?.focus();
      return;
    }
    submitting = true;

    try {
      if (password !== DEMO_PASSWORD) {
        error = "Invalid credentials. Use admin / admin for the preview.";
        return;
      }
      await auth.login(username.trim() || DEMO_USERNAME);
      navigate("/admin", { replace: true });
    } finally {
      submitting = false;
    }
  }
</script>

<div class="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-16">
  <div class="mx-auto w-full max-w-[400px]">
    {#if isExternalUrl(siteUrl)}
      <a href={siteUrl} class={backLinkClass}>
        <ArrowLeft class="h-4 w-4" aria-hidden={true} />
        Back to site
      </a>
    {:else}
      <RouterLink href={siteUrl} class={backLinkClass}>
        <ArrowLeft class="h-4 w-4" aria-hidden={true} />
        Back to site
      </RouterLink>
    {/if}

    <div class="mt-8 lg:mt-10">
      <div class="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white lg:hidden">
        {adminConfig.brand.letter}
      </div>
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
        Sign in
      </h1>
    </div>

    <form onsubmit={handleSubmit} novalidate class="mt-8 space-y-5">
      <div>
        <label for="admin-username" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Username
        </label>
        <div class="relative">
          <User aria-hidden={true} class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="admin-username"
            type="text"
            autocomplete="username"
            placeholder="Enter username"
            bind:value={username}
            aria-invalid={Boolean(fieldErrors.username)}
            aria-describedby={fieldErrors.username ? "admin-username-error" : undefined}
            class="{inputClass} {fieldErrors.username ? errorInputClass : ''}"
          />
        </div>
        {#if fieldErrors.username}
          <p id="admin-username-error" class="mt-1.5 text-sm text-error-500">{fieldErrors.username}</p>
        {/if}
      </div>

      <div>
        <label for="admin-password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div class="relative">
          <Lock aria-hidden={true} class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autocomplete="current-password"
            placeholder="Enter password"
            bind:value={password}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
            class="{inputClass} pr-11 {fieldErrors.password ? errorInputClass : ''}"
          />
          <button
            type="button"
            onclick={() => (showPassword = !showPassword)}
            class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {#if showPassword}
              <EyeOff class="h-4 w-4" aria-hidden={true} />
            {:else}
              <Eye class="h-4 w-4" aria-hidden={true} />
            {/if}
          </button>
        </div>
        {#if fieldErrors.password}
          <p id="admin-password-error" class="mt-1.5 text-sm text-error-500">{fieldErrors.password}</p>
        {/if}
      </div>

      {#if error}
        <p
          class="rounded-lg border border-error-500/30 bg-error-50 px-3 py-2.5 text-sm text-error-500 dark:bg-error-500/10"
          role="alert"
        >
          {error}
        </p>
      {/if}

      <button
        type="submit"
        disabled={submitting}
        class="flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:ring-2 focus:ring-brand-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in to dashboard"}
      </button>
    </form>

    <p
      class="mt-8 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      Demo preview - sign in with <strong class="font-semibold text-gray-700 dark:text-gray-200">admin</strong> /
      <strong class="font-semibold text-gray-700 dark:text-gray-200">admin</strong>. No real authentication.
    </p>
  </div>
</div>
