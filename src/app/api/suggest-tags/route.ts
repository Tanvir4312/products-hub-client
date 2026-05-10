import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { productName, description, existingTags } = await req.json();

    if (!productName || !description) {
      return NextResponse.json(
        { error: 'Product name and description are required' },
        { status: 400 }
      );
    }

    const existingTagsContext = existingTags?.length > 0
      ? `\n\nAvailable tags to choose from: ${existingTags.join(', ')}`
      : '';

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a product categorization expert. Suggest relevant tags in JSON format.',
        },
        {
          role: 'user',
          content: `Analyze this product and suggest relevant tags/categories for it.

Product Name: ${productName}

Description: ${description}${existingTagsContext}

Suggest 3-5 relevant tags that:
- Accurately categorize this product
- Are commonly used in tech/product platforms
- Are short (1-2 words each)
- Would help users discover this product
${existingTags?.length > 0 ? '- Prefer matching or similar to the available tags listed above when relevant' : ''}

Respond ONLY with a JSON object in this exact format:
{"suggestedTags": ["string"], "reasoning": "string"}`,
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
    console.error('Error suggesting tags:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to suggest tags' },
      { status: 500 }
    );
  }
}
