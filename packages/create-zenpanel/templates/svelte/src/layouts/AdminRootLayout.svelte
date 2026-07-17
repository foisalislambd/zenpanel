<script lang="ts">
  import type { Snippet } from "svelte";
  import { createAdminAuth } from "@/context/admin-auth-context.svelte";
  import { createAdminChatPanel } from "@/context/admin-chat-panel-context.svelte";
  import { createAdminSidebar } from "@/context/admin-sidebar-context.svelte";

  type Props = { children?: Snippet };
  let { children }: Props = $props();

  createAdminAuth();
  createAdminSidebar();
  createAdminChatPanel();
</script>

<div class="admin-shell min-h-dvh w-full">
  {@render children?.()}
</div>
