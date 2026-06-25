"use client";

import { useState } from "react";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const ask = async () => {
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setOutput(data.response);
  };

  return (
    <div className="p-5">
      <h1>AI Assistant</h1>

      <input
        className="border p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <button onClick={ask} className="ml-2 bg-black text-white px-3">
        Ask
      </button>

      <p className="mt-5">{output}</p>
    </div>
  );
}