<script lang="ts">
  import { useAdminChatPanel } from "@/context/admin-chat-panel-context.svelte";
  import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";
  import { usePathname } from "@/lib/router.svelte";

  const pathname = usePathname();
  const chat = useAdminChatPanel();

  $effect(() => {
    const path = normalizePathname(pathname.current);

    if (path === "/admin") {
      return;
    }

    const nav = matchAdminNavItem(path);

    chat.setPageContext({
      pageId: path,
      title: nav?.name ?? "Admin",
      description:
        nav?.description ??
        `Ask me anything about ${nav?.name ?? "this page"} — analyze data, get suggestions, or plan your next steps.`,
      route: path,
      getSnapshot: () => ({ route: path }),
    });

    return () => {
      if (chat.pageContext?.pageId === path) {
        chat.setPageContext(null);
      }
    };
  });
</script>
