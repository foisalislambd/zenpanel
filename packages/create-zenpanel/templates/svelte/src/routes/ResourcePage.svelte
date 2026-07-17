<script lang="ts">
  import { resourceSamples } from "../lib/data";

  let {
    title,
    resourceKey,
  }: {
    title: string;
    resourceKey: string;
  } = $props();

  const items = $derived(resourceSamples[resourceKey] ?? []);
</script>

<h1 class="page-title">{title}</h1>
<div class="admin-card">
  <div
    style="padding:1rem 1.25rem;border-bottom:1px solid var(--gray-200);font-weight:600;font-size:0.875rem"
  >
    {title}
  </div>
  {#if items.length}
    <ul style="list-style:none;margin:0;padding:0">
      {#each items as item}
        <li
          style="padding:0.875rem 1.25rem;border-bottom:1px solid var(--gray-100);font-size:0.875rem"
        >
          {item}
        </li>
      {/each}
    </ul>
  {:else}
    <p
      class="muted"
      style="padding:2.5rem 1.25rem;text-align:center;font-size:0.875rem"
    >
      No {title.toLowerCase()} yet.
    </p>
  {/if}
</div>
