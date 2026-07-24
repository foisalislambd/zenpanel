import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function DocsProse({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "docs-prose max-w-3xl text-[15px] leading-7 text-gray-700 dark:text-gray-300",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function DocsH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
      {children}
    </h1>
  );
}

export function DocsLead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
      {children}
    </p>
  );
}

export function DocsH2({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-12 scroll-mt-24 border-t border-gray-200 pt-10 text-xl font-semibold tracking-tight text-gray-900 dark:border-gray-800 dark:text-white"
    >
      {children}
    </h2>
  );
}

export function DocsH3({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h3
      id={id}
      className="mt-8 scroll-mt-24 text-base font-semibold text-gray-900 dark:text-white"
    >
      {children}
    </h3>
  );
}

export function DocsP({ children }: { children: ReactNode }) {
  return <p className="mt-4">{children}</p>;
}

export function DocsUl({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-brand-500">
      {children}
    </ul>
  );
}

export function DocsOl({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-500">
      {children}
    </ol>
  );
}

export function DocsCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-gray-800 dark:bg-white/10 dark:text-gray-100">
      {children}
    </code>
  );
}

export function DocsPre({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 px-4 py-4 font-mono text-[13px] leading-6 text-gray-100 dark:border-gray-800">
      <code>{children}</code>
    </pre>
  );
}

export function DocsCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="mt-6 rounded-xl border border-brand-100 bg-brand-50/80 px-4 py-4 text-sm text-gray-700 dark:border-brand-800/40 dark:bg-brand-950/40 dark:text-gray-300">
      <p className="font-semibold text-brand-800 dark:text-brand-300">{title}</p>
      <div className="mt-1.5">{children}</div>
    </aside>
  );
}

export function DocsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.map((row, index) => (
            <tr key={index} className="bg-white dark:bg-transparent">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
