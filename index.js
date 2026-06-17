export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // simple test
    if (url.pathname === "/") {console.log("KEY EXISTS:", !!env.OPENAI_API_KEY);
      return new Response("Worker is running", { status: 200 });
    }

    // chat endpoint
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const { message } = await request.json();

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-5.5",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message }
            ],
          }),
        });

        if (!openaiRes.ok) {
  const errorText = await openaiRes.text();
  return new Response(
    JSON.stringify({
      error: "OpenAI request failed",
      status: openaiRes.status,
      details: errorText
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

const data = await openaiRes.json();

        return new Response(
          JSON.stringify({
            reply: data.choices?.[0]?.message?.content || "No response from model"
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
