import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { productName, tags } = await req.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const tagsContext = tags?.length > 0 ? `Tags/Categories: ${tags.join(', ')}` : '';

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter. Generate product descriptions and taglines in JSON format.',
        },
        {
          role: 'user',
          content: `Generate a professional product description and tagline for a product called "${productName}".

${tagsContext}

The description should be:
- Engaging and persuasive
- Clear about what the product does
- Highlight the key benefits and value proposition
- Professional tone suitable for a product launch platform
- Around 2-3 paragraphs, max 200 words

The tagline should be:
- Memorable and catchy
- 5-10 words
- Capture the essence of the product

Respond ONLY with a JSON object in this exact format:
{"description": "string", "tagline": "string"}`,
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
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate description' },
      { status: 500 }
    );
  }
}
