export default {
  async fetch(request, env) {
    // Allow frontend to call API
    const url = new URL(request.url);

    if (url.pathname === "/chat" && request.method === "POST") {
      const { message } = await request.json();

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful chatbot." },
            { role: "user", content: message }
          ]
        })
      });

      const data = await response.json();

      return new Response(
        JSON.stringify({
          reply: data.choices[0].message.content
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response("Worker is running");
  }
};
