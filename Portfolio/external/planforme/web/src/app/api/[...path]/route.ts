import type { NextRequest } from "next/server";

// 브라우저 → Next.js(/api/*) → FastAPI. API 키는 여기(서버)에서만 붙인다.
const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function forward(req: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params;
  const url = `${API_URL}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.API_KEY) headers["X-API-Key"] = process.env.API_KEY;

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
    return new Response(res.status === 204 ? null : await res.text(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return Response.json({ detail: "API 서버에 연결할 수 없어요" }, { status: 502 });
  }
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
