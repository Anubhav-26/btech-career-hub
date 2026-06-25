"use client";

import { useState } from "react";

export default function AskAIMentor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      setAnswer(data.answer);
    } catch {
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 font-semibold">
        🤖 Ask AI Mentor
      </h3>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about GATE, CAT, DSA, Placements..."
        className="w-full rounded-md border p-2 text-sm"
        rows={4}
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-4 rounded-md border p-3 text-sm whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}