import { AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { firstError, validateUser, type FieldErrors } from "@/lib/admin-forms";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { createSignal } from "solid-js";

export type UserInput = Pick<PortalUserRow, "name" | "email" | "country" | "phone" | "status">;

type Props = {
  user: PortalUserRow | null;
  existingEmails: string[];
  onCancel: () => void;
  onSave: (input: UserInput) => Promise<void>;
};

const id = "user-form";

/** Invite / edit user dialog. Re-created per user (initial values only). */
export function UserEditor(props: Props) {
  const [name, setName] = createSignal(props.user?.name ?? "");
  const [email, setEmail] = createSignal(props.user?.email ?? "");
  const [country, setCountry] = createSignal(props.user?.country ?? "");
  const [phone, setPhone] = createSignal(props.user?.phone ?? "");
  const [status, setStatus] = createSignal<UserAccountStatus>(props.user?.status ?? "active");
  const [errors, setErrors] = createSignal<FieldErrors<"name" | "email" | "phone">>({});
  const [saving, setSaving] = createSignal(false);

  const fieldClass = (key: "name" | "email" | "phone") => cn(adminInputClass, errors()[key] && adminInputErrorClass);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const next = validateUser({ name: name(), email: email(), phone: phone() }, props.existingEmails);
    setErrors(next);
    const first = firstError(["name", "email", "phone"] as const, next);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await props.onSave({
        name: name().trim(),
        email: email().trim().toLowerCase(),
        country: country().trim() || null,
        phone: phone().trim() || null,
        status: status(),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open
      title={props.user ? "Edit user" : "Invite user"}
      description={
        props.user
          ? "Update profile details and account status."
          : "They'll receive an email invitation to set a password."
      }
      onClose={props.onCancel}
      footer={
        <>
          <button type="button" class="admin-btn admin-btn-secondary" onClick={() => props.onCancel()}>
            Cancel
          </button>
          <button type="submit" form={id} disabled={saving()} class="admin-btn admin-btn-primary">
            {saving() ? "Saving…" : props.user ? "Save changes" : "Send invite"}
          </button>
        </>
      }
    >
      <form id={id} novalidate class="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <AdminFormField id={`${id}-name`} label="Full name" required error={errors().name} class="sm:col-span-2">
          <input
            id={`${id}-name`}
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            data-autofocus
            autocomplete="off"
            aria-invalid={Boolean(errors().name)}
            aria-describedby={fieldDescribedBy(`${id}-name`, errors().name)}
            class={fieldClass("name")}
          />
        </AdminFormField>
        <AdminFormField id={`${id}-email`} label="Email" required error={errors().email} class="sm:col-span-2">
          <input
            id={`${id}-email`}
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            type="email"
            autocomplete="off"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors().email)}
            aria-describedby={fieldDescribedBy(`${id}-email`, errors().email)}
            class={fieldClass("email")}
          />
        </AdminFormField>
        <AdminFormField id={`${id}-country`} label="Country">
          <input
            id={`${id}-country`}
            value={country()}
            onInput={(e) => setCountry(e.currentTarget.value)}
            class={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField id={`${id}-phone`} label="Phone" error={errors().phone}>
          <input
            id={`${id}-phone`}
            value={phone()}
            onInput={(e) => setPhone(e.currentTarget.value)}
            type="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={Boolean(errors().phone)}
            aria-describedby={fieldDescribedBy(`${id}-phone`, errors().phone)}
            class={fieldClass("phone")}
          />
        </AdminFormField>
        <AdminFormField id={`${id}-status`} label="Account status" class="sm:col-span-2">
          <select
            id={`${id}-status`}
            class={adminInputClass}
            onChange={(e) => setStatus(e.currentTarget.value as UserAccountStatus)}
          >
            <option value="active" selected={status() === "active"}>
              Active
            </option>
            <option value="banned" selected={status() === "banned"}>
              Banned
            </option>
          </select>
        </AdminFormField>
      </form>
    </AdminDialog>
  );
}
