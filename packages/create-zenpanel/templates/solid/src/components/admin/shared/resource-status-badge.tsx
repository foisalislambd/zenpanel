import type { AdminResourceStatus } from "@/lib/admin-data/resources";
import { resourceStatusStyles } from "@/lib/admin-resources";

export function ResourceStatusBadge(props: { status: AdminResourceStatus; label: string }) {
  return (
    <span
      class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${resourceStatusStyles[props.status]}`}
    >
      {props.label}
    </span>
  );
}
