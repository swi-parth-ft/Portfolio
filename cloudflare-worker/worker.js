const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
});

const jsonResponse = (data, origin, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin)
    }
  });
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedRaw = (env.ALLOWED_ORIGINS || "").trim();
    const allowed = allowedRaw === "*" ? ["*"] : allowedRaw.split(",").map(item => item.trim()).filter(Boolean);
    const isAllowed = allowed.includes("*") ? true : allowed.includes(origin);
    const allowOrigin = allowed.includes("*") ? "*" : origin;

    if (request.method === "OPTIONS") {
      if (!isAllowed) {
        return new Response(null, { status: 403, headers: corsHeaders("null") });
      }
      return new Response(null, { status: 204, headers: corsHeaders(allowOrigin) });
    }

    if (!isAllowed) {
      return jsonResponse({ error: "Forbidden" }, "null", 403);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, allowOrigin, 405);
    }

    if (!env.OPENAI_API_KEY) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, allowOrigin, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return jsonResponse({ error: "Invalid JSON" }, allowOrigin, 400);
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      return jsonResponse({ error: "Messages are required" }, allowOrigin, 400);
    }

    const payload = {
      model: env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: typeof body.temperature === "number" ? body.temperature : 0.6,
      max_tokens: typeof body.max_tokens === "number" ? body.max_tokens : 220
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      return jsonResponse({ error: "Upstream error", detail: data }, allowOrigin, response.status);
    }

    return jsonResponse(data, allowOrigin, 200);
  }
};
