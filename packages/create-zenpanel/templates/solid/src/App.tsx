import { ThemeProvider } from "@/components/theme/theme-provider";
import HomePage from "@/pages/HomePage";
import { ZenPanelAdminRoutes } from "@/routes/admin-routes";
import { Navigate, Route, Router } from "@solidjs/router";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Route path="/" component={HomePage} />
        <ZenPanelAdminRoutes />
        <Route path="*" component={() => <Navigate href="/" />} />
      </Router>
    </ThemeProvider>
  );
}
