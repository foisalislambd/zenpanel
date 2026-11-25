import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { useAdminToast } from "@/components/admin/ui/admin-toast-provider";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

function SettingsCard({
  title,
  description,
  children,
  footer,
  onSubmit,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  onSubmit?: (e: FormEvent) => void;
}) {
  const Wrapper = onSubmit ? "form" : "div";
  return (
    <Wrapper onSubmit={onSubmit} noValidate={onSubmit ? true : undefined} className="admin-card overflow-hidden">
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 md:px-6 dark:border-gray-800 dark:bg-white/[0.02]">
          {footer}
        </div>
      )}
    </Wrapper>
  );
}

export { SettingsCard };

/** Profile details for the signed-in administrator. */
export function AccountSettings() {
  const { admin, updateProfile } = useAdminAuth();
  const { toast } = useAdminToast();
  const [username, setUsername] = useState(admin?.username ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

  const dirty = username !== (admin?.username ?? "") || email !== (admin?.email ?? "");

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[a-z0-9_.-]{3,32}$/i.test(username.trim())) {
      next.username = "3–32 characters: letters, numbers, dot, dash or underscore.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    if (next.username || next.email) {
      document.getElementById(next.username ? "settings-username" : "settings-email")?.focus();
      return;
    }
    updateProfile({ username: username.trim(), email: email.trim() });
    toast({ title: "Profile updated", description: "Your account details were saved." });
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Profile"
        description="How you appear across the admin panel."
        onSubmit={submit}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              disabled={!dirty}
              onClick={() => {
                setUsername(admin?.username ?? "");
                setEmail(admin?.email ?? "");
                setErrors({});
              }}
            >
              Reset
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={!dirty}>
              Save changes
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField id="settings-username" label="Username" required error={errors.username}>
            <input
              id="settings-username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={fieldDescribedBy("settings-username", errors.username)}
              className={cn(adminInputClass, errors.username && adminInputErrorClass)}
            />
          </AdminFormField>
          <AdminFormField id="settings-email" label="Email" required error={errors.email}>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={fieldDescribedBy("settings-email", errors.email)}
              className={cn(adminInputClass, errors.email && adminInputErrorClass)}
            />
          </AdminFormField>
        </div>
        <dl className="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
          <div>
            <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">{admin?.role ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "-"}
            </dd>
          </div>
        </dl>
      </SettingsCard>
    </div>
  );
}

/** Password change with confirmation and strength rules. */
export function SecuritySettings() {
  const { toast } = useAdminToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!current) errs.current = "Enter your current password.";
    if (next.length < 8) errs.next = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) errs.next = "Include at least one letter and one number.";
    else if (next === current) errs.next = "New password must be different from the current one.";
    if (confirm !== next) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    const first = (["current", "next", "confirm"] as const).find((k) => errs[k]);
    if (first) {
      document.getElementById(`security-${first}`)?.focus();
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  }

  const field = (key: "current" | "next" | "confirm", label: string, value: string, set: (v: string) => void, hint?: string) => (
    <AdminFormField id={`security-${key}`} label={label} required error={errors[key]} hint={hint}>
      <input
        id={`security-${key}`}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => set(e.currentTarget.value)}
        autoComplete={key === "current" ? "current-password" : "new-password"}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={fieldDescribedBy(`security-${key}`, errors[key], hint)}
        className={cn(adminInputClass, errors[key] && adminInputErrorClass)}
      />
    </AdminFormField>
  );

  return (
    <SettingsCard
      title="Password"
      description="Choose a strong password you don't use elsewhere."
      onSubmit={submit}
      footer={
        <button type="submit" className="admin-btn admin-btn-primary">
          Update password
        </button>
      }
    >
      {field("current", "Current password", current, setCurrent)}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("next", "New password", next, setNext, "At least 8 characters with a letter and a number.")}
        {field("confirm", "Confirm new password", confirm, setConfirm)}
      </div>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        {show ? "Hide passwords" : "Show passwords"}
      </button>
    </SettingsCard>
  );
}
