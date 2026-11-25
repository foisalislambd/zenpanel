import type { AdminResource } from "@/lib/admin-data/resources";

export type ResourceInput = Pick<AdminResource, "title" | "status" | "meta">;
