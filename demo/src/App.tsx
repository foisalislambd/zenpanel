import { ThemeProvider } from "@/components/theme/theme-provider";
import HomePage from "@/pages/HomePage";
import { zenPanelAdminRoute } from "@/routes/admin-routes";
import { zenPanelDocsRoute } from "@/routes/docs-routes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getBase } from "vite-basepath/runtime";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={getBase()}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {zenPanelDocsRoute}
          {zenPanelAdminRoute}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
