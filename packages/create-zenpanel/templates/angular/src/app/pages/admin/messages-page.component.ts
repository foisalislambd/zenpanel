import { Component } from '@angular/core';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminEmptyStateComponent } from '@/app/admin/ui/admin-empty-state.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';

@Component({
  selector: 'app-messages-page',
  imports: [AdminBreadcrumbsComponent, AdminPageHeaderComponent, AdminEmptyStateComponent],
  template: `
    <div class="admin-content flex h-full min-h-0 flex-col space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <app-admin-breadcrumbs />
      <app-admin-page-header title="Messages" />

      <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside class="admin-card flex w-full max-w-xs shrink-0 flex-col overflow-hidden md:max-w-sm">
          <div class="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">0 conversations</p>
          </div>
          <div class="flex min-h-0 flex-1 overflow-y-auto">
            <app-admin-empty-state
              icon="inbox"
              title="No messages yet"
              description="When customers reach out, their conversations will appear here. Connect your messaging API to get started."
            />
          </div>
        </aside>

        <div class="admin-card hidden min-w-0 flex-1 flex-col md:flex">
          <app-admin-empty-state
            icon="message-circle"
            title="Select a conversation"
            description="Choose a thread from the inbox to read and reply."
          />
        </div>
      </div>
    </div>
  `,
})
export class MessagesPageComponent {}
