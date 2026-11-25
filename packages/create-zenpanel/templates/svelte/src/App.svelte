<script lang="ts">
  import ThemeProvider from "@/components/theme/ThemeProvider.svelte";
  import HomePage from "@/pages/HomePage.svelte";
  import AdminRootLayout from "@/layouts/AdminRootLayout.svelte";
  import AdminAuthLayout from "@/layouts/AdminAuthLayout.svelte";
  import AdminDashboardLayout from "@/layouts/AdminDashboardLayout.svelte";
  import LoginPage from "@/pages/admin/LoginPage.svelte";
  import DashboardPage from "@/pages/admin/DashboardPage.svelte";
  import ProjectsPage from "@/pages/admin/ProjectsPage.svelte";
  import ServicesPage from "@/pages/admin/ServicesPage.svelte";
  import ServiceOrdersPage from "@/pages/admin/ServiceOrdersPage.svelte";
  import TransactionsPage from "@/pages/admin/TransactionsPage.svelte";
  import PaymentsPage from "@/pages/admin/PaymentsPage.svelte";
  import BlogPage from "@/pages/admin/BlogPage.svelte";
  import ProductsPage from "@/pages/admin/ProductsPage.svelte";
  import CategoriesPage from "@/pages/admin/CategoriesPage.svelte";
  import MessagesPage from "@/pages/admin/MessagesPage.svelte";
  import NewsletterPage from "@/pages/admin/NewsletterPage.svelte";
  import UsersPage from "@/pages/admin/UsersPage.svelte";
  import SettingsPage from "@/pages/admin/SettingsPage.svelte";
  import NotFoundPage from "@/pages/admin/NotFoundPage.svelte";
  import { matchAdminNavItem } from "@/lib/admin-nav";
  import { setDocumentTitle } from "@/lib/preferences";
  import { usePathname } from "@/lib/router.svelte";

  const pathname = usePathname();
  const route = $derived(pathname.route);
  const isAdminRoute = $derived(route.id === "admin-login" || route.id.startsWith("admin-"));

  /** "Users · ZenPanel" - from the matching nav item, login or 404. */
  $effect(() => {
    const title =
      route.id === "admin-login"
        ? "Sign in"
        : route.id === "not-found" || route.id === "admin-not-found"
          ? "Page not found"
          : matchAdminNavItem(route.pathname)?.name;
    setDocumentTitle(title);
  });
</script>

<ThemeProvider>
  {#if route.id === "home"}
    <HomePage />
  {:else if isAdminRoute}
    <!-- Keep one AdminRootLayout mounted across login ↔ dashboard so in-memory auth survives. -->
    <AdminRootLayout>
      {#if route.id === "admin-login"}
        <AdminAuthLayout>
          <LoginPage />
        </AdminAuthLayout>
      {:else}
        <AdminDashboardLayout>
          {#if route.id === "admin-dashboard"}
            <DashboardPage />
          {:else if route.id === "admin-projects"}
            <ProjectsPage />
          {:else if route.id === "admin-services"}
            <ServicesPage />
          {:else if route.id === "admin-service-orders"}
            <ServiceOrdersPage />
          {:else if route.id === "admin-transactions"}
            <TransactionsPage />
          {:else if route.id === "admin-payments"}
            <PaymentsPage />
          {:else if route.id === "admin-blog"}
            <BlogPage />
          {:else if route.id === "admin-products"}
            <ProductsPage />
          {:else if route.id === "admin-categories"}
            <CategoriesPage />
          {:else if route.id === "admin-messages"}
            <div class="flex h-full min-h-0 flex-1 flex-col">
              <MessagesPage />
            </div>
          {:else if route.id === "admin-newsletter"}
            <NewsletterPage />
          {:else if route.id === "admin-users"}
            <UsersPage />
          {:else if route.id === "admin-settings"}
            <SettingsPage />
          {:else}
            <NotFoundPage variant="admin" />
          {/if}
        </AdminDashboardLayout>
      {/if}
    </AdminRootLayout>
  {:else}
    <NotFoundPage />
  {/if}
</ThemeProvider>
