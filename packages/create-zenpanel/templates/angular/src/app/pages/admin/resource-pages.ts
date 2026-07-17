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
  template: `<app-resource-page title="Projects" [items]="items" description="Portfolio projects and case studies" />`,
})
export class ProjectsPageComponent {
  readonly items = adminProjects;
}

@Component({
  selector: 'app-services-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Services" [items]="items" description="Service offerings and pricing" />`,
})
export class ServicesPageComponent {
  readonly items = adminServices;
}

@Component({
  selector: 'app-service-orders-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Service orders" [items]="items" description="Customer service purchases" />`,
})
export class ServiceOrdersPageComponent {
  readonly items = adminServiceOrders;
}

@Component({
  selector: 'app-transactions-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Transactions" [items]="items" description="Wallet and ledger activity" />`,
})
export class TransactionsPageComponent {
  readonly items = adminTransactions;
}

@Component({
  selector: 'app-payments-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Payments" [items]="items" description="Deposits and payment providers" />`,
})
export class PaymentsPageComponent {
  readonly items = adminPayments;
}

@Component({
  selector: 'app-blog-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Blog" [items]="items" />`,
})
export class BlogPageComponent {
  readonly items = adminBlogPosts;
}

@Component({
  selector: 'app-products-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Products" [items]="items" />`,
})
export class ProductsPageComponent {
  readonly items = adminProducts;
}

@Component({
  selector: 'app-categories-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Categories" [items]="items" />`,
})
export class CategoriesPageComponent {
  readonly items = adminCategories;
}

@Component({
  selector: 'app-messages-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Messages" [items]="[]" />`,
})
export class MessagesPageComponent {}

@Component({
  selector: 'app-newsletter-page',
  imports: [ResourcePageComponent],
  template: `<app-resource-page title="Newsletter" [items]="items" />`,
})
export class NewsletterPageComponent {
  readonly items = adminNewsletter;
}
