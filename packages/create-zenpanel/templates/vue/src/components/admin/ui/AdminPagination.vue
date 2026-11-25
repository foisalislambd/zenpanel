<script setup lang="ts">
import { computed, useId } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { pageWindow } from "@/lib/admin-resources";
import { ADMIN_PAGE_SIZE, ADMIN_PAGE_SIZE_OPTIONS } from "@/lib/pagination";

const props = withDefaults(
  defineProps<{
    page: number;
    pageCount: number;
    total: number;
    pageSize?: number;
    /** Show the "Rows" select. */
    showPageSize?: boolean;
  }>(),
  { pageSize: ADMIN_PAGE_SIZE, showPageSize: false },
);

const emit = defineEmits<{
  pageChange: [page: number];
  pageSizeChange: [size: number];
}>();

const sizeId = useId();
const start = computed(() => (props.page - 1) * props.pageSize + 1);
const end = computed(() => Math.min(props.page * props.pageSize, props.total));
const items = computed(() => pageWindow(props.page, props.pageCount));

const button =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const idle =
  "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
const active = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";
</script>

<template>
  <nav
    v-if="total > 0"
    aria-label="Pagination"
    class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
  >
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
        Showing
        <span class="font-medium text-gray-700 dark:text-gray-200">{{ start }}–{{ end }}</span>
        of <span class="font-medium text-gray-700 dark:text-gray-200">{{ total }}</span>
      </p>
      <label v-if="showPageSize" :for="sizeId" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        Rows
        <select
          :id="sizeId"
          :value="pageSize"
          class="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @change="emit('pageSizeChange', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="size in ADMIN_PAGE_SIZE_OPTIONS" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
    </div>
    <div class="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        :class="[button, idle]"
        :disabled="page <= 1"
        aria-label="Previous page"
        @click="emit('pageChange', page - 1)"
      >
        <ChevronLeft class="h-4 w-4" aria-hidden="true" />
      </button>
      <template v-for="(item, index) in items" :key="item === 'ellipsis' ? `e-${index}` : item">
        <span v-if="item === 'ellipsis'" class="px-1 text-sm text-gray-400" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          :aria-label="`Page ${item}`"
          :aria-current="item === page ? 'page' : undefined"
          :class="[button, item === page ? active : idle]"
          @click="emit('pageChange', item)"
        >
          {{ item }}
        </button>
      </template>
      <button
        type="button"
        :class="[button, idle]"
        :disabled="page >= pageCount"
        aria-label="Next page"
        @click="emit('pageChange', page + 1)"
      >
        <ChevronRight class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>
