import { expect, test } from "bun:test";
import { buildLastWeekSeries } from "../../src/chart/weekly";

test("buildLastWeekSeries buckets by day and averages ratings", () => {
  const now = new Date("2026-02-23T12:00:00.000Z");
  const rows = [
    { timestamp: "2026-02-23T01:00:00.000Z", rating: 6 },
    { timestamp: "2026-02-23T08:30:00.000Z", rating: 8 },
    { timestamp: "2026-02-21T08:30:00.000Z", rating: 4 },
    { timestamp: "2026-02-10T08:30:00.000Z", rating: 10 },
  ];

  const points = buildLastWeekSeries(rows, "en-US", now);

  expect(points).toHaveLength(7);
  expect(points[6]?.value).toBe(7);
  expect(points[4]?.value).toBe(4);
});
