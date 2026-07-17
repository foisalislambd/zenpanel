<script lang="ts">
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.svelte";
  import AdminEmptyState from "@/components/admin/ui/AdminEmptyState.svelte";
  import { Inbox, MessageCircle } from "lucide-svelte";
</script>

<div class="admin-content flex h-full min-h-0 flex-col space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
  <AdminBreadcrumbs />
  <AdminPageHeader title="Messages" />

  <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
    <aside class="admin-card flex w-full max-w-xs shrink-0 flex-col overflow-hidden md:max-w-sm">
      <div class="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">0 conversations</p>
      </div>
      <div class="flex min-h-0 flex-1 overflow-y-auto">
        <AdminEmptyState
          icon={Inbox}
          title="No messages yet"
          description="When customers reach out, their conversations will appear here. Connect your messaging API to get started."
        />
      </div>
    </aside>

    <div class="admin-card hidden min-w-0 flex-1 flex-col md:flex">
      <AdminEmptyState
        icon={MessageCircle}
        title="Select a conversation"
        description="Choose a thread from the inbox to read and reply."
      />
    </div>
  </div>
</div>
