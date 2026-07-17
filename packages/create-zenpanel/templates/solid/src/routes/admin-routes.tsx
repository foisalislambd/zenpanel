import { AdminAuthLayout } from "@/layouts/AdminAuthLayout";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { AdminRootLayout } from "@/layouts/AdminRootLayout";
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
import { Route } from "@solidjs/router";

function MessagesRoute() {
  return (
    <div class="flex h-full min-h-0 flex-1 flex-col">
      <MessagesPage />
    </div>
  );
}

/** Shared admin route tree — used by App and install-mode example. */
export function ZenPanelAdminRoutes() {
  return (
    <Route path="/admin" component={AdminRootLayout}>
      <Route path="" component={AdminAuthLayout}>
        <Route path="/login" component={LoginPage} />
      </Route>

      <Route path="" component={AdminDashboardLayout}>
        <Route path="/" component={DashboardPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/service-orders" component={ServiceOrdersPage} />
        <Route path="/transactions" component={TransactionsPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/messages" component={MessagesRoute} />
        <Route path="/newsletter" component={NewsletterPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/settings" component={SettingsPage} />
      </Route>
    </Route>
  );
}
