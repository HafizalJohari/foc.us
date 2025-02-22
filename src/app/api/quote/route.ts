import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a motivational quote generator. Generate a short, inspiring quote specifically for students studying for exams. Include the author. Format the response as JSON with 'text' and 'author' fields."
        },
        {
          role: "user",
          content: "Generate a motivational quote for studying."
        }
      ],
      temperature: 1.0,
      max_tokens: 100,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{"text": "", "author": ""}');
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json({
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    });
  }
} 