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
  import { navigate, usePathname } from "@/lib/router.svelte";

  const pathname = usePathname();
  const route = $derived(pathname.route);

  $effect(() => {
    if (route.id === "not-found") {
      navigate("/", { replace: true });
    }
  });
</script>

<ThemeProvider>
  {#if route.id === "home"}
    <HomePage />
  {:else if route.id === "admin-login"}
    <AdminRootLayout>
      <AdminAuthLayout>
        <LoginPage />
      </AdminAuthLayout>
    </AdminRootLayout>
  {:else if route.id.startsWith("admin-")}
    <AdminRootLayout>
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
        {/if}
      </AdminDashboardLayout>
    </AdminRootLayout>
  {/if}
</ThemeProvider>
