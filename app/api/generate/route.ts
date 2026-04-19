import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { flourType, preferment, desiredCrumb, ambientTemp } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert artisan bread baker. Provide detailed fermentation schedules including autolyse, fold, and proof timelines with shaping notes for professional and home bakers. Use markdown with a clear timeline format.`,
        },
        {
          role: "user",
          content: `Plan a bread fermentation schedule:\n- Flour type: ${flourType}\n- Preferment: ${preferment} (e.g., poolish, sponge, biga, or none)\n- Desired crumb: ${desiredCrumb}\n- Ambient temperature: ${ambientTemp}°F\n\nProvide:\n1. Autolyse duration and notes\n2. Mixing and stretch/fold schedule\n3. Bulk fermentation timeline\n4. Shaping technique recommendations\n5. Final proof time and criteria\n6. Baking instructions (Dutch oven or open oven)\n7. Total time from start to finished loaf`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
