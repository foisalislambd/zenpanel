"use client";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { UiPreviewBanner } from "@/components/admin/shared/ui-preview-banner";
import { demoMessages } from "@/lib/demo-data/resources";
import { MessageCircle } from "lucide-react";

export default function AdminMessagesPage() {
  return (
    <div className="admin-content flex h-full min-h-0 flex-col space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <AdminPageHeader
        title="Messages"
        description="Inbox layout sample — not connected to chat."
      />
      <UiPreviewBanner />

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside className="admin-card flex w-full max-w-xs shrink-0 flex-col overflow-hidden md:max-w-sm">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
          </div>
          <ul className="admin-scrollbar flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {demoMessages.map((msg) => (
              <li key={msg.id}>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                >
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {msg.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{msg.meta}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="admin-card hidden min-w-0 flex-1 flex-col items-center justify-center md:flex">
          <MessageCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">Conversation view</p>
          <p className="mt-1 max-w-sm text-center text-xs text-gray-400">
            Build message thread UI in your product when the backend is ready.
          </p>
        </div>
      </div>
    </div>
  );
}
