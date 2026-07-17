<script lang="ts">
  import { previewOrders, previewStats, previewUsers } from "../lib/data";

  const stats: Array<[string, string | number]> = [
    ["Total users", previewStats.totalUsers],
    ["Revenue", `$${previewStats.totalRevenue.toLocaleString()}`],
    ["Orders (7d)", previewStats.newOrdersLast7Days],
    ["Unread messages", previewStats.unreadMessages],
  ];
</script>

<h1 class="page-title">Dashboard</h1>
<p class="muted" style="margin:-1rem 0 1.5rem">
  Welcome back — preview metrics for your admin shell.
</p>
<div class="stats-grid">
  {#each stats as [label, value]}
    <div class="admin-card admin-card-body stat-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  {/each}
</div>
<div class="dash-grid" style="display:grid;gap:1.25rem;margin-top:1.25rem">
  <div class="admin-card">
    <div
      style="padding:1rem 1.25rem;border-bottom:1px solid var(--gray-200);font-weight:600;font-size:0.875rem"
    >
      Recent orders
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each previewOrders as order}
            <tr>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>{order.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="admin-card">
    <div
      style="padding:1rem 1.25rem;border-bottom:1px solid var(--gray-200);font-weight:600;font-size:0.875rem"
    >
      Recent users
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {#each previewUsers as user}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.provider}</td>
              <td>{user.joined}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  @media (min-width: 1024px) {
    .dash-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
