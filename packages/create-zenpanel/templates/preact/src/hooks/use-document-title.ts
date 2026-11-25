import { adminConfig } from "@/config/admin.config";
import { useEffect } from "react";

/** Sets `document.title` to "Page · Brand". Pass `undefined` to leave it unchanged. */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} · ${adminConfig.brand.name}`;
  }, [title]);
}
