import { AdminGuestGuard } from "@/components/admin/auth/admin-guest-guard";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuestGuard>
      <div className="relative isolate min-h-dvh w-full overflow-x-hidden bg-white dark:bg-gray-950">
        {children}
      </div>
    </AdminGuestGuard>
  );
}
