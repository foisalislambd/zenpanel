import { AdminGuestGuard } from "@/components/admin/auth/admin-guest-guard";
import type { RouteSectionProps } from "@solidjs/router";

export function AdminAuthLayout(props: RouteSectionProps) {
  return (
    <AdminGuestGuard>
      <div class="relative isolate min-h-dvh w-full overflow-x-hidden bg-white dark:bg-gray-950">
        {props.children}
      </div>
    </AdminGuestGuard>
  );
}
