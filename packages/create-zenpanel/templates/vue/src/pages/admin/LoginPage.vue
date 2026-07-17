<script setup lang="ts">
import AdminLoginForm from "@/components/admin/auth/AdminLoginForm.vue";
import AdminThemeToggle from "@/components/admin/ui/AdminThemeToggle.vue";
import { adminConfig } from "@/config/admin.config";

const { brand } = adminConfig;
</script>

<template>
  <div class="relative grid min-h-dvh w-full lg:grid-cols-2">
    <div class="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
      <AdminThemeToggle />
    </div>
    <AdminLoginForm />
    <div
      class="relative hidden min-h-dvh flex-col items-center justify-center overflow-hidden bg-brand-950 px-8 py-12 text-center sm:px-10 lg:flex"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/35 blur-3xl" />
        <div class="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
        <div
          class="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/10 blur-2xl"
        />
      </div>

      <div class="relative z-10 w-full max-w-md">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg shadow-brand-500/25 sm:h-16 sm:w-16 sm:text-2xl"
        >
          {{ brand.letter }}
        </div>
        <h2 class="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {{ brand.name }}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-brand-100/90 sm:text-base">
          {{ brand.loginDescription }}
        </p>
        <ul class="mt-8 space-y-3 text-left text-sm text-brand-100/85">
          <li v-for="item in brand.loginFeatures" :key="item" class="flex items-center gap-3">
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-200"
            >
              ✓
            </span>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
