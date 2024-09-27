import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const systemPrompt = `
      You are a tutor. Your task is to generate concise study recommendations based on the questions a user answered.
       Follow these steps:
      1. Provide positive feedback on the questions the user answered correctly, highlighting their strengths.
      2. Offer constructive feedback on the questions the user answered incorrectly, identifying areas for improvement.
      3. Recommend specific websites or resources to help the user strengthen these weak areas.
      4. Summarize your response in a brief paragraph, keeping it supportive and to the point.
      5. Use common core state standards for 3rd grade math standards. 
      Return your response as a JSON object with a 'suggestion' key containing your recommendation as a string.
    `;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });

    const data = await request.json();
    const userContent = JSON.stringify(data.questions);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7, // Optional: tweak for creativity
    });

    const completionText = completion.choices[0].message.content;

    let suggestions;
    try {
      suggestions = JSON.parse(completionText); // Try parsing as JSON
    } catch (e) {
      suggestions = { suggestion: completionText }; // Fallback to plain text
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}
