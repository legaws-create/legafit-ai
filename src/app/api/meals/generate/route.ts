import { NextResponse } from "next/server";
import { openai, OPENAI_MODEL } from "@/lib/openai/client";
import type { MacroTargets } from "@/core/domain/types";

export const runtime = "nodejs";

interface GenerateBody {
  days?: number;
  targets?: MacroTargets;
  preferences?: string; // e.g. "tanpa daging babi, suka pedas, budget hemat"
}

/**
 * Generates an Indonesian meal plan. We force the model to return strict JSON
 * matching our MealPlanDay[] shape so the client can render it directly.
 */
export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY belum diset di environment." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as GenerateBody;
    const days = Math.min(Math.max(body.days ?? 3, 1), 7);
    const targets = body.targets ?? { calories: 2000, proteinG: 120, carbsG: 220, fatG: 60 };
    const prefs = body.preferences?.trim() || "tidak ada preferensi khusus";

    const system = `Kamu adalah perencana menu makan sehat khas Indonesia.
Hasilkan menu realistis, mudah dimasak, bahan mudah didapat di pasar/warung Indonesia.
Patuhi target kalori & protein semaksimal mungkin. Gunakan nama makanan Indonesia.
WAJIB balas HANYA JSON valid tanpa teks lain, tanpa markdown.`;

    const userPrompt = `Buat rencana makan ${days} hari.
Target harian: ${targets.calories} kkal, protein ${targets.proteinG} g, karbo ${targets.carbsG} g, lemak ${targets.fatG} g.
Preferensi: ${prefs}.

Format JSON persis seperti ini:
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "slot": "sarapan",
          "title": "Nasi uduk + telur",
          "items": [{ "name": "Nasi uduk", "calories": 300, "proteinG": 6, "carbsG": 45, "fatG": 10 }],
          "totalCalories": 300
        }
      ],
      "totalCalories": 0
    }
  ]
}
slot harus salah satu dari: "sarapan","makan_siang","makan_malam","camilan".`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model mengembalikan JSON tidak valid. Coba lagi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ plan: parsed, targets });
  } catch (err) {
    console.error("[/api/meals/generate]", err);
    return NextResponse.json({ error: "Gagal membuat rencana makan." }, { status: 500 });
  }
}
