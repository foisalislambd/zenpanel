import { ThemeProvider } from "@/components/theme/theme-provider";
import HomePage from "@/pages/HomePage";
import { zenPanelAdminRoute } from "@/routes/admin-routes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {zenPanelAdminRoute}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
