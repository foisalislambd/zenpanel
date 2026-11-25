import type { PortalUserRow } from "@/lib/admin-api";

export type UserInput = Pick<PortalUserRow, "name" | "email" | "country" | "phone" | "status">;
