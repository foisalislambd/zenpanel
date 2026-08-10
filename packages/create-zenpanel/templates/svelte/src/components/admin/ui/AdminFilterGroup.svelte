<script lang="ts">
  type Option<T extends string> = { value: T; label: string };

  type Props<T extends string = string> = {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
  };

  let { options, value, onChange, ariaLabel }: Props = $props();
</script>

<div
  role="group"
  aria-label={ariaLabel}
  class="flex shrink-0 flex-wrap items-center gap-1.5"
>
  {#each options as option (option.value)}
    {@const active = value === option.value}
    <button
      type="button"
      onclick={() => onChange(option.value)}
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {active
        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5'}"
    >
      {option.label}
    </button>
  {/each}
</div>
