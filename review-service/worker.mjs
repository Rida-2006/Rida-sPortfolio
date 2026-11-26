const origin = "https://rida-2006.github.io";
const headers = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};
const reply = (data, status = 200) => Response.json(data, { headers, status });

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== "/reviews") return reply({ error: "Not found" }, 404);
    if (request.method === "OPTIONS") return new Response(null, { headers, status: 204 });
    if (request.method === "GET") {
      const { results } = await env.REVIEWS.prepare(
        "SELECT id, name, context, rating, body FROM reviews ORDER BY id DESC"
      ).all();
      return reply(results);
    }
    if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
    if (request.headers.get("Origin") !== origin) return reply({ error: "Origin not allowed" }, 403);
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) return reply({ error: "Expected JSON" }, 415);
    if (!request.body) return reply({ error: "Missing review" }, 400);

    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let raw = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16000) {
        await reader.cancel();
        return reply({ error: "Review is too large" }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    let data;
    try { data = JSON.parse(raw + decoder.decode()); }
    catch { return reply({ error: "Invalid JSON" }, 400); }
    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const context = typeof data?.context === "string" ? data.context.trim() : "";
    const body = typeof data?.body === "string" ? data.body.trim() : "";
    const rating = Number(data?.rating);
    if (!name || name.length > 80 || context.length > 120 || !body || body.length > 1000 ||
      !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return reply({ error: "Invalid review fields" }, 400);
    }
    const review = await env.REVIEWS.prepare(
      "INSERT INTO reviews (name, context, body, rating) VALUES (?, ?, ?, ?) RETURNING id, name, context, body, rating"
    ).bind(name, context, body, rating).first();
    return reply({ submitted: true, review }, 201);
  }
};
