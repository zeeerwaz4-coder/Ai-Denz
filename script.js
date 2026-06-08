const API_KEY = env.OPENAI_API_KEY;
headers: {
  "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
  "Content-Type": "application/json"
}let data = await response.json();
console.log(data);
