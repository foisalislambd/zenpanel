import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/auth.guards';
import { AdminShellComponent } from './admin/layout/admin-shell.component';
import { HomePageComponent } from './pages/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { LoginPageComponent } from './pages/admin/login-page.component';
import { DashboardPageComponent } from './pages/admin/dashboard-page.component';
import { UsersPageComponent } from './pages/admin/users-page.component';
import { SettingsPageComponent } from './pages/admin/settings-page.component';
import { MessagesPageComponent } from './pages/admin/messages-page.component';
import {
  BlogPageComponent,
  CategoriesPageComponent,
  NewsletterPageComponent,
  PaymentsPageComponent,
  ProductsPageComponent,
  ProjectsPageComponent,
  ServiceOrdersPageComponent,
  ServicesPageComponent,
  TransactionsPageComponent,
} from './pages/admin/resource-pages';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'admin/login',
    title: 'Sign in',
    canActivate: [guestGuard],
    component: LoginPageComponent,
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminShellComponent,
    children: [
      { path: '', title: 'Dashboard', component: DashboardPageComponent },
      { path: 'projects', title: 'Projects', component: ProjectsPageComponent },
      { path: 'services', title: 'Services', component: ServicesPageComponent },
      { path: 'service-orders', title: 'Service orders', component: ServiceOrdersPageComponent },
      { path: 'transactions', title: 'Transactions', component: TransactionsPageComponent },
      { path: 'payments', title: 'Payments', component: PaymentsPageComponent },
      { path: 'blog', title: 'Blog', component: BlogPageComponent },
      { path: 'products', title: 'Products', component: ProductsPageComponent },
      { path: 'categories', title: 'Categories', component: CategoriesPageComponent },
      { path: 'messages', title: 'Messages', component: MessagesPageComponent },
      { path: 'newsletter', title: 'Newsletter', component: NewsletterPageComponent },
      { path: 'users', title: 'Users', component: UsersPageComponent },
      { path: 'settings', title: 'Settings', component: SettingsPageComponent },
      { path: '**', title: 'Page not found', component: NotFoundPageComponent, data: { variant: 'admin' } },
    ],
  },
  { path: '**', title: 'Page not found', component: NotFoundPageComponent },
];
