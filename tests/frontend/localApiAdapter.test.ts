import { afterEach, expect, mock, test } from "bun:test";
import { LocalApiRatingsAdapter } from "../../src/data/adapters/localApi";

afterEach(() => {
  mock.restore();
});

test("LocalApiRatingsAdapter maps requests correctly", async () => {
  const fetchMock = mock(async (input: string | URL | Request) => {
    const url = String(input);

    if (url.endsWith("/api/health")) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (url.includes("/api/checkins?") && url.includes("from=") && url.includes("to=")) {
      return new Response(
        JSON.stringify({
          items: [
            {
              timestamp: "2026-02-23T00:00:00.000Z",
              words: ["calm"],
              suggestedWordsUsed: [],
              contextTags: ["sleep"],
              intensity: { energy: 4, stress: 3, anxiety: 2, joy: 6 },
            },
          ],
        }),
        { status: 200 },
      );
    }

    if (url.endsWith("/api/checkins")) {
      return new Response(null, { status: 201 });
    }

    return new Response(null, { status: 404 });
  });

  globalThis.fetch = fetchMock as typeof fetch;

  const adapter = new LocalApiRatingsAdapter({ baseUrl: "http://localhost:8787" });
  await adapter.init();

  await adapter.appendCheckIn({
    timestamp: "2026-02-23T00:00:00.000Z",
    words: ["calm"],
    suggestedWordsUsed: ["calm"],
    contextTags: ["sleep"],
    intensity: { energy: 4, stress: 3, anxiety: 2, joy: 6 },
  });

  const rows = await adapter.listCheckIns({
    fromIso: "2026-02-17T00:00:00.000Z",
    toIso: "2026-02-23T23:59:59.999Z",
  });

  expect(rows).toHaveLength(1);
  expect(rows[0]).toEqual({
    timestamp: "2026-02-23T00:00:00.000Z",
    words: ["calm"],
    suggestedWordsUsed: [],
    contextTags: ["sleep"],
    intensity: { energy: 4, stress: 3, anxiety: 2, joy: 6 },
  });
  expect(fetchMock).toHaveBeenCalledTimes(3);
});
