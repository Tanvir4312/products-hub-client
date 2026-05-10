import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { upvotedProducts } = await req.json();

    if (!upvotedProducts || upvotedProducts.length === 0) {
      return NextResponse.json(
        { error: 'No upvoted products provided' },
        { status: 400 }
      );
    }

    // Format the upvoted products for the prompt
    const productsContext = upvotedProducts
      .map((p: any) => `- ${p.name}${p.tags?.length > 0 ? ` (Tags: ${p.tags.map((t: any) => t.tag?.name).join(', ')})` : ''}`)
      .join('\n');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a product recommendation expert. Analyze user preferences and suggest relevant categories in JSON format.',
        },
        {
          role: 'user',
          content: `Based on the user's upvoted products, suggest relevant product categories and keywords they might be interested in.

User's Upvoted Products:
${productsContext}

Analyze the patterns in these products and suggest:
1. 3-5 relevant product categories/tags that align with their interests
2. 5-8 specific keywords to help discover similar products
3. A brief reasoning (1 sentence) explaining the recommendation logic

Respond ONLY with a JSON object in this exact format:
{"recommendedCategories": ["string"], "keywords": ["string"], "reasoning": "string"}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from Groq');
    }

    const object = JSON.parse(content);
    return NextResponse.json(object);
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
