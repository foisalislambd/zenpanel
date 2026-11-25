<script setup lang="ts">
import { computed } from "vue";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-vue-next";
import { cn } from "@/lib/cn";
import type { SortDirection } from "@/lib/sort";

/** Clickable, accessible column header (`aria-sort` lives on the <th>). */
const props = defineProps<{ label: string; active: boolean; direction: SortDirection }>();
const emit = defineEmits<{ sort: [] }>();

const icon = computed(() => (!props.active ? ChevronsUpDown : props.direction === "asc" ? ArrowUp : ArrowDown));
</script>

<template>
  <th
    scope="col"
    :aria-sort="active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'"
    class="px-5 py-3"
  >
    <button
      type="button"
      :class="
        cn(
          '-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white',
          active ? 'text-gray-900 dark:text-white' : 'text-gray-500',
        )
      "
      @click="emit('sort')"
    >
      {{ label }}
      <component :is="icon" :class="cn('h-3.5 w-3.5', !active && 'opacity-60')" aria-hidden="true" />
    </button>
  </th>
</template>
