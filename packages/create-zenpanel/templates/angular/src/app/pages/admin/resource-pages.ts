import { Component } from '@angular/core';
import { ResourcePageComponent } from '@/app/admin/shared/resource-page.component';
import {
  adminBlogPosts,
  adminCategories,
  adminNewsletter,
  adminPayments,
  adminProducts,
  adminProjects,
  adminServiceOrders,
  adminServices,
  adminTransactions,
} from '@/app/lib/admin-data/resources';

@Component({
  selector: 'app-projects-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Projects" resourceLabel="project" [items]="items" />`,
})
export class ProjectsPageComponent {
  readonly items = adminProjects;
}

@Component({
  selector: 'app-services-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Services" resourceLabel="service" [items]="items" />`,
})
export class ServicesPageComponent {
  readonly items = adminServices;
}

@Component({
  selector: 'app-service-orders-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Service orders" resourceLabel="order" [items]="items" />`,
})
export class ServiceOrdersPageComponent {
  readonly items = adminServiceOrders;
}

@Component({
  selector: 'app-transactions-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Transactions" resourceLabel="transaction" [items]="items" />`,
})
export class TransactionsPageComponent {
  readonly items = adminTransactions;
}

@Component({
  selector: 'app-payments-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Payments" resourceLabel="payment" [items]="items" />`,
})
export class PaymentsPageComponent {
  readonly items = adminPayments;
}

@Component({
  selector: 'app-blog-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Blog" resourceLabel="post" [items]="items" />`,
})
export class BlogPageComponent {
  readonly items = adminBlogPosts;
}

@Component({
  selector: 'app-products-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Products" resourceLabel="product" [items]="items" />`,
})
export class ProductsPageComponent {
  readonly items = adminProducts;
}

@Component({
  selector: 'app-categories-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Categories" resourceLabel="category" [items]="items" />`,
})
export class CategoriesPageComponent {
  readonly items = adminCategories;
}

@Component({
  selector: 'app-newsletter-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Newsletter" resourceLabel="subscriber" [items]="items" />`,
})
export class NewsletterPageComponent {
  readonly items = adminNewsletter;
}
