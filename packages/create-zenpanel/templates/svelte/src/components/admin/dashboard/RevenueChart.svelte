<script lang="ts">
  import DashboardSectionHeader from "@/components/admin/dashboard/DashboardSectionHeader.svelte";
  import type { ChartDataPoint } from "@/lib/admin-api";
  import { formatCurrency } from "@/lib/format";

  type Props = { data: ChartDataPoint[] };
  let { data }: Props = $props();

  const WIDTH = 640;
  const HEIGHT = 220;
  const PAD = { l: 46, r: 16, t: 18, b: 28 };
  const RANGES = [
    { days: 7, label: "7D" },
    { days: 30, label: "30D" },
    { days: 90, label: "90D" },
  ] as const;
  const SERIES_END = new Date(2026, 8, 22);

  function seriesFor(source: ChartDataPoint[], days: number): ChartDataPoint[] {
    if (source.length === 0) return [];
    const points: ChartDataPoint[] = [];
    for (let ago = days - 1; ago >= 0; ago--) {
      const date = new Date(SERIES_END);
      date.setDate(SERIES_END.getDate() - ago);
      const known = ago < source.length ? source[source.length - 1 - ago] : undefined;
      const seed = (date.getDate() * 17 + date.getMonth() * 13) % 97;
      points.push({
        label:
          days <= 7 && known
            ? known.label
            : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        revenue: known?.revenue ?? 3200 + ((seed * 61) % 5400),
        orders: known?.orders ?? 2 + (seed % 8),
      });
    }
    return points;
  }

  function showsLabel(index: number, count: number) {
    if (count <= 7) return true;
    const step = count <= 30 ? 5 : 15;
    return index === 0 || index === count - 1 || index % step === 0;
  }

  let active = $state<number | null>(null);
  let days = $state<(typeof RANGES)[number]["days"]>(7);

  function niceMax(value: number) {
    if (value <= 0) return 1;
    const exp = 10 ** Math.floor(Math.log10(value));
    const fraction = value / exp;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return nice * exp;
  }

  function axisMoney(value: number) {
    if (value >= 1000) {
      const thousands = value / 1000;
      const label = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1);
      return `$${label}k`;
    }
    return formatCurrency(value);
  }

  function smoothLine(points: { x: number; y: number }[]) {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const curve = (next.x - current.x) / 2;
      path += ` C ${current.x + curve} ${current.y}, ${next.x - curve} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }

  const series = $derived(seriesFor(data, days));
  const totalRevenue = $derived(series.reduce((sum, point) => sum + point.revenue, 0));
  const totalOrders = $derived(series.reduce((sum, point) => sum + point.orders, 0));
  const chartSummary = $derived(
    `${days}-day revenue ${formatCurrency(totalRevenue)} across ${totalOrders} orders`,
  );
  const model = $derived.by(() => {
    const ceiling = niceMax(Math.max(...series.map((point) => point.revenue), 1));
    const innerW = WIDTH - PAD.l - PAD.r;
    const innerH = HEIGHT - PAD.t - PAD.b;
    const baseline = PAD.t + innerH;
    const points = series.map((point, index) => {
      const x = series.length === 1 ? PAD.l + innerW / 2 : PAD.l + (index / (series.length - 1)) * innerW;
      const y = PAD.t + (1 - point.revenue / ceiling) * innerH;
      return { ...point, x, y };
    });
    const line = smoothLine(points);
    const area =
      points.length > 0
        ? `${line} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
        : "";
    return { ceiling, innerW, innerH, baseline, points, line, area, ticks: [ceiling, ceiling / 2, 0] };
  });
  const activePoint = $derived(active == null ? null : model.points[active]);
</script>

<div class="admin-card w-full overflow-hidden">
  <DashboardSectionHeader title="Revenue">
    {#snippet trailing()}
      <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-white/10" role="group" aria-label="Chart range">
        {#each RANGES as range (range.days)}
          <button
            type="button"
            aria-pressed={days === range.days}
            class="rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 {days === range.days ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}"
            onclick={() => {
              days = range.days;
              active = null;
            }}
          >
            {range.label}
          </button>
        {/each}
      </div>
    {/snippet}
  </DashboardSectionHeader>

  <div class="px-3 pt-3 pb-4 sm:px-5">
    {#if series.length === 0}
      <div class="flex h-52 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No revenue data yet
      </div>
    {:else}
      <div
        class="relative w-full"
        style:aspect-ratio="{WIDTH} / {HEIGHT}"
        onmouseleave={() => (active = null)}
      >
        <svg viewBox="0 0 {WIDTH} {HEIGHT}" class="h-full w-full" role="img" aria-label={chartSummary}>
          <defs>
            <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#465fff" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#465fff" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          {#each model.ticks as tick (tick)}
            <line
              x1={PAD.l}
              x2={WIDTH - PAD.r}
              y1={PAD.t + (1 - tick / model.ceiling) * model.innerH}
              y2={PAD.t + (1 - tick / model.ceiling) * model.innerH}
              class="text-gray-200 dark:text-gray-800"
              stroke="currentColor"
              stroke-dasharray={tick === 0 ? undefined : "4 6"}
            />
            <text
              x={PAD.l - 8}
              y={PAD.t + (1 - tick / model.ceiling) * model.innerH + 4}
              text-anchor="end"
              class="fill-gray-400 text-[11px] dark:fill-gray-500"
            >
              {axisMoney(tick)}
            </text>
          {/each}
          <path d={model.area} fill="url(#revenue-area)" />
          <path
            d={model.line}
            fill="none"
            class="text-brand-500"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          {#if activePoint}
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={PAD.t}
              y2={model.baseline}
              class="text-brand-300 dark:text-brand-400"
              stroke="currentColor"
              stroke-dasharray="3 4"
            />
          {/if}
          {#each model.points as point, index (point.label + index)}
            {#if showsLabel(index, series.length)}
              <text
                x={point.x}
                y={HEIGHT - 8}
                text-anchor="middle"
                class="fill-gray-500 text-[11px] dark:fill-gray-400"
              >
                {point.label}
              </text>
            {/if}
            {#if series.length <= 14 || active === index}
              <circle
                cx={point.x}
                cy={point.y}
                r={active === index ? 5 : 3.5}
                class="fill-white text-brand-500 dark:fill-gray-950"
                stroke="currentColor"
                stroke-width="2"
              />
            {/if}
            <rect
              x={Math.max(PAD.l, point.x - (series.length <= 1 ? model.innerW : model.innerW / (series.length - 1)) / 2)}
              y={PAD.t}
              width={Math.min(PAD.l + model.innerW, point.x + (series.length <= 1 ? model.innerW : model.innerW / (series.length - 1)) / 2) - Math.max(PAD.l, point.x - (series.length <= 1 ? model.innerW : model.innerW / (series.length - 1)) / 2)}
              height={model.innerH}
              fill="transparent"
              onmouseenter={() => (active = index)}
            />
          {/each}
        </svg>
        {#if activePoint}
          <div
            class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
            style:left="{(activePoint.x / WIDTH) * 100}%"
            style:top="{(activePoint.y / HEIGHT) * 100}%"
          >
            <p class="font-medium text-gray-900 dark:text-white">{activePoint.label}</p>
            <p class="text-gray-500 dark:text-gray-400">
              {formatCurrency(activePoint.revenue)} · {activePoint.orders} orders
            </p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
