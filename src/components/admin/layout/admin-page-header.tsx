import type { ReactNode } from "react";

type Props = {
  title: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
