const OPENAI_API_KEY = env.OPENAI_API_KEY;const API_KEY = "paste-your-key-here";
let data = await response.json();
console.log(data);
if (!data.choices) {
    add(JSON.stringify(data), "Bot");
    return;
}

let reply = data.choices[0].message.content;
add(reply, "Bot");
