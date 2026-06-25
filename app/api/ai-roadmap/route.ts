import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { branch, targetExam, currentYear } = await req.json();

    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        {
          error: "OPENROUTER_API_KEY missing",
        },
        {
          status: 500,
        }
      );
    }

    const prompt = `
Create a detailed 6 month roadmap.

Branch: ${branch}
Current Year: ${currentYear}
Target Exam: ${targetExam}

Return ONLY valid JSON.

{
  "exam": "${targetExam}",
  "branch": "${branch}",
  "months": [
    {
      "month": "Month 1",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}
`;

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
                "You are an expert engineering mentor. Return ONLY valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "OpenRouter API Error",
          details: errorText,
        },
        {
          status: 500,
        }
      );
    }

    const result = await response.json();

    const content =
      result?.choices?.[0]?.message?.content || "{}";

    try {
      const roadmap = JSON.parse(content);

      return NextResponse.json({
        data: roadmap,
      });
    } catch {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: content,
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Roadmap generation failed",
      },
      {
        status: 500,
      }
    );
  }
}