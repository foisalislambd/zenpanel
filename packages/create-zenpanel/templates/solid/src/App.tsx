import { ThemeProvider } from "@/components/theme/theme-provider";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";
import { setDocumentTitle } from "@/lib/preferences";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/admin/NotFoundPage";
import { ZenPanelAdminRoutes } from "@/routes/admin-routes";
import { Route, Router, useLocation, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

/** Keeps `document.title` in sync: "Users · ZenPanel", "Sign in", "Page not found". */
function AppRoot(props: RouteSectionProps) {
  const location = useLocation();
  createEffect(() => {
    const path = normalizePathname(location.pathname);
    if (path === "/") return setDocumentTitle();
    if (path === "/admin/login") return setDocumentTitle("Sign in");
    setDocumentTitle(matchAdminNavItem(path)?.name ?? "Page not found");
  });
  return <>{props.children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router root={AppRoot}>
        <Route path="/" component={HomePage} />
        <ZenPanelAdminRoutes />
        <Route path="*404" component={() => <NotFoundPage />} />
      </Router>
    </ThemeProvider>
  );
}
