export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // CORS headers (IMPORTANT)
    // =========================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // =========================
    // HEALTH CHECK (browser test)
    // =========================
    if (request.method === "GET") {
      return new Response("Worker is running ✅", {
        headers: corsHeaders,
      });
    }

    // =========================
    // CHAT ENDPOINT
    // =========================
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = body.message;

        if (!message) {
          return new Response(
            JSON.stringify({ error: "No message provided" }),
            { status: 400, headers: corsHeaders }
          );
        }

        // =========================
        // OPENAI REQUEST
        // =========================
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message }
            ],
          }),
        });

        const data = await openaiResponse.json();

        const reply =
          data?.choices?.[0]?.message?.content || "No response from AI";

        return new Response(
          JSON.stringify({ reply }),
          { headers: corsHeaders }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // =========================
    // INVALID ROUTE
    // =========================
    return new Response("Not found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};
