import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert B.Tech mentor. Help students with GATE, CAT, Placements, DSA, Aptitude, Resume and Career guidance.",
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      answer:
        data?.choices?.[0]?.message?.content ||
        "No response received",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to get AI response",
      },
      {
        status: 500,
      }
    );
  }
}