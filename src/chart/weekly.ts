export type RatingPoint = {
  dayKey: string;
  dayLabel: string;
  value: number | null;
};

export type RatingRow = {
  timestamp: string;
  rating: number;
};

export function buildLastWeekSeries(rows: RatingRow[], locale: string, now = new Date()): RatingPoint[] {
  const end = startOfDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);

  const buckets = new Map<string, number[]>();

  for (const row of rows) {
    const date = new Date(row.timestamp);
    if (Number.isNaN(date.getTime()) || !Number.isFinite(row.rating)) {
      continue;
    }

    const day = startOfDay(date);
    if (day < start || day > end) {
      continue;
    }

    const key = toDayKey(day);
    const values = buckets.get(key) ?? [];
    values.push(row.rating);
    buckets.set(key, values);
  }

  const points: RatingPoint[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = toDayKey(day);
    const values = buckets.get(key);

    points.push({
      dayKey: key,
      dayLabel: day.toLocaleDateString(locale, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }),
      value: values && values.length > 0 ? average(values) : null,
    });
  }

  return points;
}

export function drawWeeklyChart(canvas: HTMLCanvasElement, emptyEl: HTMLElement, points: RatingPoint[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const hasData = points.some((point) => point.value !== null);
  emptyEl.classList.toggle("hidden", hasData);

  const width = canvas.width;
  const height = canvas.height;
  const left = 52;
  const right = 24;
  const top = 20;
  const bottom = 52;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const chartBg = cssVar("--chart-bg", "#ffffff");
  const chartGrid = cssVar("--chart-grid", "#d8d8d8");
  const chartAxis = cssVar("--chart-axis", "#666666");
  const chartLine = cssVar("--chart-line", "#1f6d8a");
  const chartPoint = cssVar("--chart-point", "#1f6d8a");
  const chartValue = cssVar("--chart-value", "#123b4c");
  const chartLabel = cssVar("--chart-label", "#444444");

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = chartBg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = chartGrid;
  ctx.lineWidth = 1;

  for (let yTick = 1; yTick <= 10; yTick += 1) {
    const y = top + plotHeight - ((yTick - 1) / 9) * plotHeight;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();

    if (yTick % 3 === 1 || yTick === 10) {
      ctx.fillStyle = chartAxis;
      ctx.font = "12px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(String(yTick), left - 8, y + 4);
    }
  }

  const xForIndex = (index: number): number => left + (index / 6) * plotWidth;
  const yForValue = (value: number): number => top + plotHeight - ((value - 1) / 9) * plotHeight;

  ctx.strokeStyle = chartLine;
  ctx.lineWidth = 2;
  ctx.beginPath();

  let started = false;
  points.forEach((point, index) => {
    if (point.value === null) {
      started = false;
      return;
    }

    const x = xForIndex(index);
    const y = yForValue(point.value);

    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const x = xForIndex(index);

    if (point.value !== null) {
      const y = yForValue(point.value);
      ctx.fillStyle = chartPoint;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = chartValue;
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(point.value.toFixed(1), x, y - 8);
    }

    ctx.fillStyle = chartLabel;
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(point.dayLabel, x, height - 20);
  });
}

function average(values: number[]): number {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
