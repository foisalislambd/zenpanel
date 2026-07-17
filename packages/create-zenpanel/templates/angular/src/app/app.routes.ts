import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/auth.guards';
import { AdminShellComponent } from './admin/layout/admin-shell.component';
import { HomePageComponent } from './pages/home-page.component';
import { LoginPageComponent } from './pages/admin/login-page.component';
import { DashboardPageComponent } from './pages/admin/dashboard-page.component';
import { UsersPageComponent } from './pages/admin/users-page.component';
import { SettingsPageComponent } from './pages/admin/settings-page.component';
import {
  BlogPageComponent,
  CategoriesPageComponent,
  MessagesPageComponent,
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
    canActivate: [guestGuard],
    component: LoginPageComponent,
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminShellComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'projects', component: ProjectsPageComponent },
      { path: 'services', component: ServicesPageComponent },
      { path: 'service-orders', component: ServiceOrdersPageComponent },
      { path: 'transactions', component: TransactionsPageComponent },
      { path: 'payments', component: PaymentsPageComponent },
      { path: 'blog', component: BlogPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'messages', component: MessagesPageComponent },
      { path: 'newsletter', component: NewsletterPageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
