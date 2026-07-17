<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, Lock, User } from "lucide-vue-next";
import { useAdminAuth } from "@/composables/use-admin-auth";
import { adminConfig } from "@/config/admin.config";
import { isExternalUrl } from "@/lib/admin-nav";

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white";

const backLinkClass =
  "inline-flex text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200";

const auth = useAdminAuth();
const router = useRouter();

const username = ref(DEMO_USERNAME);
const password = ref(DEMO_PASSWORD);
const showPassword = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);

const siteUrl = adminConfig.brand.siteUrl || "/";

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = null;
  submitting.value = true;

  try {
    if (password.value !== DEMO_PASSWORD) {
      error.value = "Invalid credentials. Use admin / admin for the preview.";
      return;
    }
    await auth.login(username.value.trim() || DEMO_USERNAME);
    router.replace("/admin");
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-16">
    <div class="mx-auto w-full max-w-[400px]">
      <a v-if="isExternalUrl(siteUrl)" :href="siteUrl" :class="backLinkClass">← Back to site</a>
      <RouterLink v-else :to="siteUrl" :class="backLinkClass">← Back to site</RouterLink>

      <div class="mt-8 lg:mt-10">
        <div
          class="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white lg:hidden"
        >
          {{ adminConfig.brand.letter }}
        </div>
        <h1
          class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]"
        >
          Sign in
        </h1>
        <p class="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Preview UI — credentials are prefilled. Click sign in to open the dashboard.
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit="handleSubmit">
        <div>
          <label
            for="admin-username"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>
          <div class="relative">
            <User
              class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              id="admin-username"
              v-model="username"
              type="text"
              autocomplete="username"
              :class="inputClass"
            />
          </div>
        </div>

        <div>
          <label
            for="admin-password"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div class="relative">
            <Lock
              class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :class="`${inputClass} pr-11`"
            />
            <button
              type="button"
              class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-300"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <p v-if="error" class="text-sm text-error-500" role="alert">{{ error }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:ring-2 focus:ring-brand-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ submitting ? "Signing in…" : "Sign in to dashboard" }}
        </button>
      </form>

      <p class="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
        UI preview only — no real authentication.
      </p>
    </div>
  </div>
</template>
