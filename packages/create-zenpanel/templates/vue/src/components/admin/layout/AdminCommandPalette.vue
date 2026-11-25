<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useRouter } from "vue-router";
import { CornerDownLeft, Moon, Plus, Search } from "lucide-vue-next";
import { adminNavItems } from "@/config/admin.config";
import { useTheme } from "@/composables/use-theme";
import { buildPaletteCommands, rankPaletteCommands, type PaletteCommand } from "@/lib/command-palette";
import { activateDialog } from "@/lib/dialog";
import { cn } from "@/lib/cn";

/** ⌘K / Ctrl+K quick navigation across admin pages and common actions. */
const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const theme = useTheme();
const query = ref("");
const active = ref(0);
const panel = ref<HTMLElement | null>(null);
const listId = useId();

const commands = computed(() =>
  buildPaletteCommands(adminNavItems, { plus: Plus, moon: Moon }, theme.resolvedTheme === "dark"),
);
const results = computed(() => rankPaletteCommands(commands.value, query.value));
const activeIndex = computed(() => Math.min(active.value, Math.max(0, results.value.length - 1)));

function run(command: PaletteCommand<unknown>) {
  emit("close");
  if (command.action === "toggle-theme") {
    theme.setTheme(theme.resolvedTheme === "dark" ? "light" : "dark");
  } else if (command.href) {
    void router.push(command.href);
  }
}

function onKeyDown(e: KeyboardEvent) {
  const count = Math.max(1, results.value.length);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    active.value = (activeIndex.value + 1) % count;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = (activeIndex.value - 1 + count) % count;
  } else if (e.key === "Enter") {
    e.preventDefault();
    const command = results.value[activeIndex.value];
    if (command) run(command);
  }
}

watch(activeIndex, async (index) => {
  await nextTick();
  document.getElementById(`${listId}-${index}`)?.scrollIntoView({ block: "nearest" });
});

let release: (() => void) | null = null;
onMounted(() => {
  if (panel.value) release = activateDialog(panel.value, () => emit("close"));
});
onBeforeUnmount(() => release?.());
</script>

<template>
  <Teleport to="body">
    <div class="admin-portal fixed inset-0 z-[60] flex items-start justify-center p-3 pt-[10vh] sm:p-4">
      <div class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" aria-hidden="true" @click="emit('close')" />
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        tabindex="-1"
        class="admin-dialog relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none sm:mt-[12vh] sm:self-start dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
          <Search class="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            v-model="query"
            data-autofocus
            placeholder="Search pages and actions…"
            class="h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
            role="combobox"
            aria-expanded="true"
            :aria-controls="listId"
            :aria-activedescendant="results.length ? `${listId}-${activeIndex}` : undefined"
            aria-autocomplete="list"
            aria-label="Search pages and actions"
            @input="active = 0"
            @keydown="onKeyDown"
          />
          <kbd class="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:block dark:border-gray-700 dark:text-gray-400">
            Esc
          </kbd>
        </div>
        <ul :id="listId" role="listbox" aria-label="Results" class="admin-scrollbar max-h-[min(60dvh,420px)] overflow-y-auto p-2">
          <li v-if="results.length === 0" class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No results for “{{ query }}”
          </li>
          <li v-for="(c, index) in results" :key="c.id" role="presentation">
            <p
              v-if="results[index - 1]?.group !== c.group"
              class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
            >
              {{ c.group }}
            </p>
            <div
              :id="`${listId}-${index}`"
              role="option"
              :aria-selected="index === activeIndex"
              :class="
                cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                  index === activeIndex
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-gray-700 dark:text-gray-300',
                )
              "
              @mousemove="active = index"
              @click="run(c)"
            >
              <component :is="c.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
              <span class="flex-1 truncate font-medium">{{ c.label }}</span>
              <span v-if="c.hint" class="text-xs text-gray-500 dark:text-gray-400">{{ c.hint }}</span>
              <CornerDownLeft v-if="index === activeIndex" class="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
