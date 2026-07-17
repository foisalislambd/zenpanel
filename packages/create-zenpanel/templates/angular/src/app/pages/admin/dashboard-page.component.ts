import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { AdminChatPanelService, type AdminChatQuickAction } from '@/app/core/admin-chat-panel.service';
import {
  previewFetchActivity,
  previewFetchChartData,
  previewFetchRecentOrders,
  previewFetchStats,
  previewFetchUsers,
  type ActivityItem,
  type ChartDataPoint,
  type DashboardStats,
  type PortalUserRow,
  type RecentOrder,
} from '@/app/lib/admin-api';
import { AdminLoadingComponent } from '@/app/admin/ui/admin-loading.component';
import { DashboardWelcomeComponent } from '@/app/admin/dashboard/dashboard-welcome.component';
import { StatsCardsComponent } from '@/app/admin/dashboard/stats-cards.component';
import { RevenueChartComponent } from '@/app/admin/dashboard/revenue-chart.component';
import { ActivityFeedComponent } from '@/app/admin/dashboard/activity-feed.component';
import { DashboardSidebarComponent } from '@/app/admin/dashboard/dashboard-sidebar.component';
import { RecentOrdersTableComponent } from '@/app/admin/dashboard/recent-orders-table.component';
import { RecentUsersTableComponent } from '@/app/admin/dashboard/recent-users-table.component';

const DASHBOARD_QUICK_ACTIONS: AdminChatQuickAction[] = [
  {
    id: 'growth',
    label: 'Analyze growth',
    prompt: 'Analyze our user growth metrics and summarize key trends',
  },
  {
    id: 'revenue',
    label: 'Revenue summary',
    prompt: 'Summarize revenue and order performance for this week',
  },
  { id: 'help', label: 'What can you do?', prompt: 'What can you help me with on the dashboard?' },
];

const DASHBOARD_PAGE_ID = 'dashboard';

@Component({
  selector: 'app-dashboard-page',
  host: { class: 'block w-full' },
  imports: [
    AdminLoadingComponent,
    DashboardWelcomeComponent,
    StatsCardsComponent,
    RevenueChartComponent,
    ActivityFeedComponent,
    DashboardSidebarComponent,
    RecentOrdersTableComponent,
    RecentUsersTableComponent,
  ],
  template: `
    @if (loading()) {
      <app-admin-loading message="Loading dashboard…" />
    } @else if (error()) {
      <div class="admin-card admin-card-body text-sm text-error-500">{{ error() }}</div>
    } @else {
      <!-- Use flex+gap (not space-y): Angular host elements are otherwise too tight. -->
      <div class="admin-content flex flex-col gap-5">
        <app-dashboard-welcome />

        @if (stats(); as s) {
          <app-stats-cards [stats]="s" />
        }

        <div class="grid items-start gap-5 xl:grid-cols-3">
          <div class="flex flex-col gap-5 xl:col-span-2">
            @if (chart().length > 0) {
              <app-revenue-chart [chartData]="chart()" />
            }
            <app-activity-feed [items]="activity()" />
          </div>

          @if (stats(); as s) {
            <app-dashboard-sidebar [usersByProvider]="s.usersByProvider" [totalUsers]="s.totalUsers" />
          }
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <app-recent-orders-table [orders]="orders()" />
          <app-recent-users-table [users]="users()" />
        </div>
      </div>
    }
  `,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private readonly chat = inject(AdminChatPanelService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly stats = signal<DashboardStats | null>(null);
  readonly users = signal<PortalUserRow[]>([]);
  readonly chart = signal<ChartDataPoint[]>([]);
  readonly activity = signal<ActivityItem[]>([]);
  readonly orders = signal<RecentOrder[]>([]);

  private ownsPageContext = false;

  ngOnInit(): void {
    this.registerPageContext();

    Promise.all([
      previewFetchStats(),
      previewFetchUsers(),
      previewFetchChartData(),
      previewFetchActivity(),
      previewFetchRecentOrders(),
    ])
      .then(([statsRes, usersRes, chartRes, activityRes, ordersRes]) => {
        this.stats.set(statsRes.stats);
        this.users.set(usersRes.users);
        this.chart.set(chartRes.chart);
        this.activity.set(activityRes.activity);
        this.orders.set(ordersRes.orders);
      })
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard');
      })
      .finally(() => this.loading.set(false));
  }

  ngOnDestroy(): void {
    // Avoid wiping a newer route/page context if navigation already replaced ours.
    if (this.ownsPageContext && this.chat.pageContext()?.pageId === DASHBOARD_PAGE_ID) {
      this.chat.setPageContext(null);
    }
  }

  private registerPageContext(): void {
    this.ownsPageContext = true;
    this.chat.setPageContext({
      pageId: DASHBOARD_PAGE_ID,
      title: 'Dashboard',
      route: '/admin',
      description:
        'Analyze metrics, summarize revenue and orders, or get suggestions for your admin workflow.',
      getSnapshot: () => {
        const s = this.stats();
        return s
          ? {
              totalUsers: s.totalUsers,
              totalRevenue: s.totalRevenue,
              newOrdersLast7Days: s.newOrdersLast7Days,
              unreadMessages: s.unreadMessages,
              totalProjects: s.totalProjects,
              newsletterSubscribers: s.newsletterSubscribers,
              newUsersLast7Days: s.newUsersLast7Days,
            }
          : {};
      },
      quickActions: DASHBOARD_QUICK_ACTIONS,
    });
  }
}
