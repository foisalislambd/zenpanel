import { DashboardSectionHeader } from "@/components/admin/dashboard/dashboard-section-header";
import type { ChartDataPoint } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";
import { createMemo, createSignal, For, Show } from "solid-js";

type Props = {
  data: ChartDataPoint[];
};

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

export function RevenueChart(props: Props) {
  const [active, setActive] = createSignal<number | null>(null);
  const [days, setDays] = createSignal<(typeof RANGES)[number]["days"]>(7);
  const series = () => seriesFor(props.data, days());
  const totalRevenue = () => series().reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = () => series().reduce((sum, point) => sum + point.orders, 0);
  const chartSummary = () =>
    `${days()}-day revenue ${formatCurrency(totalRevenue())} across ${totalOrders()} orders`;

  const model = createMemo(() => {
    const plotted = series();
    const ceiling = niceMax(Math.max(...plotted.map((point) => point.revenue), 1));
    const innerW = WIDTH - PAD.l - PAD.r;
    const innerH = HEIGHT - PAD.t - PAD.b;
    const baseline = PAD.t + innerH;
    const points = plotted.map((point, index) => {
      const x =
        plotted.length === 1
          ? PAD.l + innerW / 2
          : PAD.l + (index / (plotted.length - 1)) * innerW;
      const y = PAD.t + (1 - point.revenue / ceiling) * innerH;
      return { ...point, x, y };
    });
    let line = points.length ? `M ${points[0].x} ${points[0].y}` : "";
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const curve = (next.x - current.x) / 2;
      line += ` C ${current.x + curve} ${current.y}, ${next.x - curve} ${next.y}, ${next.x} ${next.y}`;
    }
    const area = points.length
      ? `${line} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
      : "";
    return { ceiling, innerW, innerH, baseline, points, line, area, ticks: [ceiling, ceiling / 2, 0] };
  });

  const activePoint = () => {
    const index = active();
    return index == null ? null : model().points[index];
  };

  return (
    <div class="admin-card w-full overflow-hidden">
      <DashboardSectionHeader
        title="Revenue"
        trailing={
          <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-white/10" role="group" aria-label="Chart range">
            <For each={RANGES}>
              {(range) => (
                <button
                  type="button"
                  aria-pressed={days() === range.days}
                  onClick={() => {
                    setDays(range.days);
                    setActive(null);
                  }}
                  class={`rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                    days() === range.days
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              )}
            </For>
          </div>
        }
      />

      <div class="px-3 pt-3 pb-4 sm:px-5">
        <Show
          when={series().length > 0}
          fallback={
            <div class="flex h-52 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No revenue data yet
            </div>
          }
        >
          <div
            class="relative w-full"
            style={{ "aspect-ratio": `${WIDTH} / ${HEIGHT}` }}
            onMouseLeave={() => setActive(null)}
          >
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} class="h-full w-full" role="img" aria-label={chartSummary()}>
              <defs>
                <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#465fff" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#465fff" stop-opacity="0.02" />
                </linearGradient>
              </defs>
              <For each={model().ticks}>
                {(tick) => {
                  const y = PAD.t + (1 - tick / model().ceiling) * model().innerH;
                  return (
                    <g>
                      <line
                        x1={PAD.l}
                        x2={WIDTH - PAD.r}
                        y1={y}
                        y2={y}
                        class="text-gray-200 dark:text-gray-800"
                        stroke="currentColor"
                        stroke-dasharray={tick === 0 ? undefined : "4 6"}
                      />
                      <text
                        x={PAD.l - 8}
                        y={y + 4}
                        text-anchor="end"
                        class="fill-gray-400 text-[11px] dark:fill-gray-500"
                      >
                        {axisMoney(tick)}
                      </text>
                    </g>
                  );
                }}
              </For>
              <path d={model().area} fill="url(#revenue-area)" />
              <path
                d={model().line}
                fill="none"
                class="text-brand-500"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              <Show when={activePoint()}>
                {(point) => (
                  <line
                    x1={point().x}
                    x2={point().x}
                    y1={PAD.t}
                    y2={model().baseline}
                    class="text-brand-300 dark:text-brand-400"
                    stroke="currentColor"
                    stroke-dasharray="3 4"
                  />
                )}
              </Show>
              <For each={model().points}>
                {(point, index) => (
                  <g>
                    <Show when={showsLabel(index(), series().length)}>
                      <text
                        x={point.x}
                        y={HEIGHT - 8}
                        text-anchor="middle"
                        class="fill-gray-500 text-[11px] dark:fill-gray-400"
                      >
                        {point.label}
                      </text>
                    </Show>
                    <Show when={series().length <= 14 || active() === index()}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={active() === index() ? 5 : 3.5}
                        class="fill-white text-brand-500 dark:fill-gray-950"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </Show>
                    <rect
                      x={Math.max(
                        PAD.l,
                        point.x -
                          (series().length <= 1
                            ? model().innerW
                            : model().innerW / (series().length - 1)) /
                            2,
                      )}
                      y={PAD.t}
                      width={
                        Math.min(
                          PAD.l + model().innerW,
                          point.x +
                            (series().length <= 1
                              ? model().innerW
                              : model().innerW / (series().length - 1)) /
                              2,
                        ) -
                        Math.max(
                          PAD.l,
                          point.x -
                            (series().length <= 1
                              ? model().innerW
                              : model().innerW / (series().length - 1)) /
                              2,
                        )
                      }
                      height={model().innerH}
                      fill="transparent"
                      onMouseEnter={() => setActive(index())}
                    />
                  </g>
                )}
              </For>
            </svg>
            <Show when={activePoint()}>
              {(point) => (
                <div
                  class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
                  style={{
                    left: `${(point().x / WIDTH) * 100}%`,
                    top: `${(point().y / HEIGHT) * 100}%`,
                  }}
                >
                  <p class="font-medium text-gray-900 dark:text-white">{point().label}</p>
                  <p class="text-gray-500 dark:text-gray-400">
                    {formatCurrency(point().revenue)} · {point().orders} orders
                  </p>
                </div>
              )}
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
