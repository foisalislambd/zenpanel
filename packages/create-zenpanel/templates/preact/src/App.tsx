import { ThemeProvider } from "@/components/theme/theme-provider";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/admin/NotFoundPage";
import { zenPanelAdminRoute } from "@/routes/admin-routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {zenPanelAdminRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
