<script lang="ts">
  type Props = { content: string };
  let { content }: Props = $props();

  const parts = $derived(content.split(/(\*\*[^*]+\*\*)/g));
</script>

<div class="admin-chat-markdown text-sm leading-relaxed">
  {#each parts as part, i (i)}
    {#if part.startsWith("**") && part.endsWith("**")}
      <strong class="font-semibold">{part.slice(2, -2)}</strong>
    {:else}
      {#each part.split("\n") as line, j (j)}
        {line}{#if j < part.split("\n").length - 1}<br />{/if}
      {/each}
    {/if}
  {/each}
</div>
