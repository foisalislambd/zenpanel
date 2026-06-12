export type AdminResource = {
  id: string;
  title: string;
  status: "published" | "draft" | "archived";
  updatedAt: string;
  meta?: string;
};

/** Empty lists — wire your API and pass real data into ResourcePage. */
export const adminProjects: AdminResource[] = [];
export const adminServices: AdminResource[] = [];
export const adminBlogPosts: AdminResource[] = [];
export const adminProducts: AdminResource[] = [];
export const adminServiceOrders: AdminResource[] = [];
export const adminTransactions: AdminResource[] = [];
export const adminPayments: AdminResource[] = [];
export const adminCategories: AdminResource[] = [];
export const adminNewsletter: AdminResource[] = [];
export const adminMessages: AdminResource[] = [];
