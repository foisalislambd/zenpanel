import { ThemeProvider } from "@/components/theme/theme-provider";
import { AdminAuthLayout } from "@/layouts/AdminAuthLayout";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { AdminRootLayout } from "@/layouts/AdminRootLayout";
import HomePage from "@/pages/HomePage";
import BlogPage from "@/pages/admin/BlogPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import LoginPage from "@/pages/admin/LoginPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import NewsletterPage from "@/pages/admin/NewsletterPage";
import PaymentsPage from "@/pages/admin/PaymentsPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import ServiceOrdersPage from "@/pages/admin/ServiceOrdersPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import TransactionsPage from "@/pages/admin/TransactionsPage";
import UsersPage from "@/pages/admin/UsersPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/admin" element={<AdminRootLayout />}>
            <Route element={<AdminAuthLayout />}>
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route element={<AdminDashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="service-orders" element={<ServiceOrdersPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route
                path="messages"
                element={
                  <div className="flex h-full min-h-0 flex-1 flex-col">
                    <MessagesPage />
                  </div>
                }
              />
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
