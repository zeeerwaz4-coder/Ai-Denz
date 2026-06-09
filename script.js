const WORKER_URL = https://https://ai-denz1.zeeerwaz4.workers.dev


function add(msg, sender) {
  let div = document.createElement("div");
  div.className = "msg " + sender;
  div.innerText = sender === "you" ? "You: " + msg : "Bot: " + msg;
  document.getElementById("chat").appendChild(div);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

async function send() {
  let input = document.getElementById("input");
  let text = input.value.trim();
  if (!text) return;

  add(text, "you");
  input.value = "";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    add(data.reply, "bot");
  } catch (err) {
    add("Error: Could not connect", "bot");
  }
}
