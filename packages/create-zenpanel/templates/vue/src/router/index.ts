import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import AdminRootLayout from "@/layouts/AdminRootLayout.vue";
import AdminAuthLayout from "@/layouts/AdminAuthLayout.vue";
import AdminDashboardLayout from "@/layouts/AdminDashboardLayout.vue";
import LoginPage from "@/pages/admin/LoginPage.vue";
import DashboardPage from "@/pages/admin/DashboardPage.vue";
import ProjectsPage from "@/pages/admin/ProjectsPage.vue";
import ServicesPage from "@/pages/admin/ServicesPage.vue";
import ServiceOrdersPage from "@/pages/admin/ServiceOrdersPage.vue";
import TransactionsPage from "@/pages/admin/TransactionsPage.vue";
import PaymentsPage from "@/pages/admin/PaymentsPage.vue";
import BlogPage from "@/pages/admin/BlogPage.vue";
import ProductsPage from "@/pages/admin/ProductsPage.vue";
import CategoriesPage from "@/pages/admin/CategoriesPage.vue";
import MessagesPage from "@/pages/admin/MessagesPage.vue";
import NewsletterPage from "@/pages/admin/NewsletterPage.vue";
import UsersPage from "@/pages/admin/UsersPage.vue";
import SettingsPage from "@/pages/admin/SettingsPage.vue";

/** Shared admin route tree — used by router and install-mode example. */
export const adminRouteIds = [
  "admin-login",
  "admin-dashboard",
  "admin-projects",
  "admin-services",
  "admin-service-orders",
  "admin-transactions",
  "admin-payments",
  "admin-blog",
  "admin-products",
  "admin-categories",
  "admin-messages",
  "admin-newsletter",
  "admin-users",
  "admin-settings",
] as const;

export type AdminRouteId = (typeof adminRouteIds)[number];

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    {
      path: "/admin",
      component: AdminRootLayout,
      children: [
        {
          path: "login",
          component: AdminAuthLayout,
          children: [{ path: "", name: "admin-login", component: LoginPage }],
        },
        {
          path: "",
          component: AdminDashboardLayout,
          children: [
            { path: "", name: "admin-dashboard", component: DashboardPage },
            { path: "projects", name: "admin-projects", component: ProjectsPage },
            { path: "services", name: "admin-services", component: ServicesPage },
            {
              path: "service-orders",
              name: "admin-service-orders",
              component: ServiceOrdersPage,
            },
            {
              path: "transactions",
              name: "admin-transactions",
              component: TransactionsPage,
            },
            { path: "payments", name: "admin-payments", component: PaymentsPage },
            { path: "blog", name: "admin-blog", component: BlogPage },
            { path: "products", name: "admin-products", component: ProductsPage },
            { path: "categories", name: "admin-categories", component: CategoriesPage },
            {
              path: "messages",
              name: "admin-messages",
              component: MessagesPage,
            },
            { path: "newsletter", name: "admin-newsletter", component: NewsletterPage },
            { path: "users", name: "admin-users", component: UsersPage },
            { path: "settings", name: "admin-settings", component: SettingsPage },
          ],
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
