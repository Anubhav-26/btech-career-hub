const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

export async function askAI(message: string) {
  if (!OPENROUTER_API_KEY) {
    return "AI key missing. Add OPENROUTER_API_KEY in .env";
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "BTech Career Hub",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI assistant for students." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await res.json();

  return (
    data?.choices?.[0]?.message?.content ||
    "No response from AI"
  );
}