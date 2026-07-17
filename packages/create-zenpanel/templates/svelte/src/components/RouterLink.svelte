<script lang="ts">
  import type { Snippet } from "svelte";
  import { navigate } from "@/lib/router.svelte";

  type Props = {
    href: string;
    class?: string;
    title?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { href, class: className, title, onclick, children, ...rest }: Props = $props();

  function handleClick(e: MouseEvent) {
    onclick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  }
</script>

<a {href} class={className} {title} onclick={handleClick} {...rest}>
  {@render children?.()}
</a>
