import { Component } from '@angular/core';
import { ResourcePageComponent } from '@/app/admin/shared/resource-page.component';
import type { AdminResourceStatus } from '@/app/lib/admin-data/resources';
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

type StatusLabels = Partial<Record<AdminResourceStatus, string>>;

@Component({
  selector: 'app-projects-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Projects"
      resourceLabel="project"
      [items]="items"
      searchPlaceholder="Search title, details..."
    />`,
})
export class ProjectsPageComponent {
  readonly items = adminProjects;
}

@Component({
  selector: 'app-services-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Services"
      resourceLabel="service"
      [items]="items"
      searchPlaceholder="Search title, pricing..."
      metaLabel="Pricing"
      [statusLabels]="statusLabels"
    />`,
})
export class ServicesPageComponent {
  readonly items = adminServices;
  readonly statusLabels: StatusLabels = { published: 'Active' };
}

@Component({
  selector: 'app-service-orders-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Service orders"
      resourceLabel="order"
      [items]="items"
      searchPlaceholder="Search customer, service, order ID..."
      titleLabel="Order"
      metaLabel="Amount"
      [statusLabels]="statusLabels"
    />`,
})
export class ServiceOrdersPageComponent {
  readonly items = adminServiceOrders;
  readonly statusLabels: StatusLabels = { published: 'Completed', draft: 'Pending', archived: 'Refunded' };
}

@Component({
  selector: 'app-transactions-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Transactions"
      resourceLabel="transaction"
      [items]="items"
      searchPlaceholder="Search title, amount, reference..."
      metaLabel="Amount"
      [statusLabels]="statusLabels"
    />`,
})
export class TransactionsPageComponent {
  readonly items = adminTransactions;
  readonly statusLabels: StatusLabels = { published: 'Settled', draft: 'Pending', archived: 'Reversed' };
}

@Component({
  selector: 'app-payments-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Payments"
      resourceLabel="payment"
      [items]="items"
      searchPlaceholder="Search title, provider, amount..."
      metaLabel="Amount"
      [statusLabels]="statusLabels"
    />`,
})
export class PaymentsPageComponent {
  readonly items = adminPayments;
  readonly statusLabels: StatusLabels = { published: 'Completed', draft: 'Pending', archived: 'Closed' };
}

@Component({
  selector: 'app-blog-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Blog"
      resourceLabel="post"
      [items]="items"
      searchPlaceholder="Search title, topic..."
    />`,
})
export class BlogPageComponent {
  readonly items = adminBlogPosts;
}

@Component({
  selector: 'app-products-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Products"
      resourceLabel="product"
      [items]="items"
      searchPlaceholder="Search title, price..."
      metaLabel="Price"
      [statusLabels]="statusLabels"
    />`,
})
export class ProductsPageComponent {
  readonly items = adminProducts;
  readonly statusLabels: StatusLabels = { published: 'Active' };
}

@Component({
  selector: 'app-categories-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Categories"
      resourceLabel="category"
      [items]="items"
      searchPlaceholder="Search title, items..."
      metaLabel="Items"
      [statusLabels]="statusLabels"
    />`,
})
export class CategoriesPageComponent {
  readonly items = adminCategories;
  readonly statusLabels: StatusLabels = { published: 'Visible', draft: 'Hidden' };
}

@Component({
  selector: 'app-newsletter-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page
      title="Newsletter"
      resourceLabel="subscriber"
      [items]="items"
      searchPlaceholder="Search email, source..."
      titleLabel="Email"
      metaLabel="Preferences"
      [titleIsEmail]="true"
      [statusLabels]="statusLabels"
    />`,
})
export class NewsletterPageComponent {
  readonly items = adminNewsletter;
  readonly statusLabels: StatusLabels = { published: 'Subscribed', draft: 'Pending', archived: 'Unsubscribed' };
}
