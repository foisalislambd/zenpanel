import { AdminGuestGuard } from "@/components/admin/auth/admin-guest-guard";
import { Outlet } from "react-router-dom";

export function AdminAuthLayout() {
  return (
    <AdminGuestGuard>
      <div className="relative isolate min-h-dvh w-full overflow-x-hidden bg-white dark:bg-gray-950">
        <Outlet />
      </div>
    </AdminGuestGuard>
  );
}
