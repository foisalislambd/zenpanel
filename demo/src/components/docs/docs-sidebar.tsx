import { docsNav } from "@/config/docs-nav";
import { cn } from "@/lib/cn";
import { NavLink } from "react-router-dom";

type Props = {
  onNavigate?: () => void;
  className?: string;
};

export function DocsSidebar({ onNavigate, className }: Props) {
  return (
    <nav className={cn("space-y-8", className)} aria-label="Documentation">
      {docsNav.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {section.title}
          </p>
          <ul className="mt-2 space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  end={item.href === "/docs"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-brand-50 font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                    )
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
