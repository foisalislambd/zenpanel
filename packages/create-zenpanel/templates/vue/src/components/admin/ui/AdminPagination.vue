<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    page: number;
    pageCount: number;
    total: number;
    pageSize?: number;
  }>(),
  { pageSize: 5 },
);

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const start = computed(() => (props.page - 1) * props.pageSize + 1);
const end = computed(() => Math.min(props.page * props.pageSize, props.total));

const items = computed(() => {
  const { page, pageCount } = props;
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1) as Array<
      number | "ellipsis"
    >;
  }
  const windowItems: Array<number | "ellipsis"> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pageCount - 1, page + 1);
  if (from > 2) windowItems.push("ellipsis");
  for (let index = from; index <= to; index += 1) windowItems.push(index);
  if (to < pageCount - 1) windowItems.push("ellipsis");
  windowItems.push(pageCount);
  return windowItems;
});

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
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Showing
      <span class="font-medium text-gray-700 dark:text-gray-200">{{ start }}–{{ end }}</span>
      of
      <span class="font-medium text-gray-700 dark:text-gray-200">{{ total }}</span>
    </p>
    <div class="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        :class="[button, idle]"
        :disabled="page <= 1"
        aria-label="Previous page"
        @click="emit('pageChange', page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <template v-for="(item, index) in items" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="px-1 text-sm text-gray-400">…</span>
        <button
          v-else
          type="button"
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
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </nav>
</template>
