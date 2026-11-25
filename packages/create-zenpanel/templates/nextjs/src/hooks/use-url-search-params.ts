"use client";

import { usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type SetOptions = { replace?: boolean };

/**
 * `[params, setParams]` over the App Router's search params, mirroring the
 * react-router API used by the Vite templates. `params` is a mutable copy.
 * Components using this must render inside a <Suspense> boundary.
 */
export function useSearchParams() {
  const current = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useMemo(() => new URLSearchParams(current.toString()), [current]);

  const setParams = useCallback(
    (next: URLSearchParams | Record<string, string>, options: SetOptions = {}) => {
      const query = new URLSearchParams(next).toString();
      const href = query ? `${pathname}?${query}` : pathname;
      if (options.replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [pathname, router],
  );

  return [params, setParams] as const;
}
