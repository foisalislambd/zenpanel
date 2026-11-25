<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Compass, LayoutDashboard } from "lucide-vue-next";
import { setDocumentTitle } from "@/lib/preferences";

/** 404 page - `admin` renders inside the dashboard shell. */
const props = withDefaults(defineProps<{ variant?: "admin" | "page" }>(), { variant: "page" });

const route = useRoute();
const router = useRouter();
const inAdmin = props.variant === "admin";

onMounted(() => setDocumentTitle("Page not found"));
</script>

<template>
  <component
    :is="inAdmin ? 'div' : 'main'"
    :class="
      inAdmin
        ? 'admin-content admin-card px-6 py-16 sm:py-24'
        : 'admin-shell flex min-h-dvh items-center justify-center px-6 py-16 dark:bg-gray-950'
    "
  >
    <div class="mx-auto flex max-w-md flex-col items-center text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
        <Compass class="h-7 w-7" aria-hidden="true" />
      </span>
      <p class="mt-6 text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
      <h1 class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">Page not found</h1>
      <p class="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        We couldn’t find
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs break-all text-gray-700 dark:bg-white/10 dark:text-gray-200">{{
          route.path
        }}</code
        >. It may have been moved, or the link is incorrect.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" class="admin-btn admin-btn-secondary" @click="router.back()">
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          Go back
        </button>
        <RouterLink :to="inAdmin ? '/admin' : '/'" class="admin-btn admin-btn-primary">
          <LayoutDashboard class="h-4 w-4" aria-hidden="true" />
          {{ inAdmin ? "Back to dashboard" : "Back to home" }}
        </RouterLink>
      </div>
    </div>
  </component>
</template>
