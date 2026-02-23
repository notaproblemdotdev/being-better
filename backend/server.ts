import { createDatabase } from "./db";
import { SqliteRatingsRepo } from "./repo/sqliteRatingsRepo";

type ServerDeps = {
  repo: SqliteRatingsRepo;
};

export function createHandler(deps: ServerDeps): (req: Request) => Promise<Response> {
  const { repo } = deps;

  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return withCors(json({ ok: true }));
    }

    if (req.method === "POST" && url.pathname === "/api/ratings") {
      try {
        const payload = (await req.json()) as { timestamp?: string; rating?: number };
        repo.append({
          timestamp: payload.timestamp ?? "",
          rating: payload.rating ?? Number.NaN,
        });
        return withCors(new Response(null, { status: 201 }));
      } catch {
        return withCors(json({ error: "invalid_request" }, { status: 400 }));
      }
    }

    if (req.method === "GET" && url.pathname === "/api/ratings") {
      const from = url.searchParams.get("from") ?? "";
      const to = url.searchParams.get("to") ?? "";

      try {
        const items = repo.list(from, to);
        return withCors(json({ items }));
      } catch {
        return withCors(json({ error: "invalid_range" }, { status: 400 }));
      }
    }

    return withCors(json({ error: "not_found" }, { status: 404 }));
  };
}

export function createServer(deps: ServerDeps) {
  const port = Number(process.env.PORT ?? 8787);
  const fetch = createHandler(deps);

  return Bun.serve({
    port,
    fetch,
  });
}

function json(payload: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

if (import.meta.main) {
  const db = createDatabase();
  const repo = new SqliteRatingsRepo(db);
  const server = createServer({ repo });
  // eslint-disable-next-line no-console
  console.log(`Local backend listening on http://localhost:${server.port}`);
}
