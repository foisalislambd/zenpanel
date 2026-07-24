import { AdminLoginForm } from "@/components/admin/auth/admin-login-form";
import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { adminConfig } from "@/config/admin.config";

function BrandPanel({ className = "" }: { className?: string }) {
  const { brand } = adminConfig;

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-brand-950 px-8 py-12 text-center sm:px-10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/35 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg shadow-brand-500/25 sm:h-16 sm:w-16 sm:text-2xl">
          {brand.letter}
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {brand.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-100/90 sm:text-base">
          {brand.loginDescription}
        </p>
        <ul className="mt-8 space-y-3 text-left text-sm text-brand-100/85">
          {brand.loginFeatures.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-200">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative grid min-h-dvh w-full lg:grid-cols-2">
      <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
        <AdminThemeToggle />
      </div>
      <AdminLoginForm />
      <BrandPanel className="hidden min-h-dvh lg:flex" />
    </div>
  );
}
