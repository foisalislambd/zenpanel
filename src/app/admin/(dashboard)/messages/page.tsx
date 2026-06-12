"use client";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { MessageCircle } from "lucide-react";

export default function AdminMessagesPage() {
  return (
    <div className="admin-content flex h-full min-h-0 flex-col space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <AdminPageHeader
        title="Messages"
        description="Inbox and conversation threads."
      />

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside className="admin-card flex w-full max-w-xs shrink-0 flex-col overflow-hidden md:max-w-sm">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
          </div>
          <div className="admin-card-body flex flex-1 items-center justify-center py-12 text-center text-sm text-gray-500">
            No messages yet
          </div>
        </aside>

        <div className="admin-card hidden min-w-0 flex-1 flex-col items-center justify-center md:flex">
          <MessageCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">Select a conversation</p>
        </div>
      </div>
    </div>
  );
}
