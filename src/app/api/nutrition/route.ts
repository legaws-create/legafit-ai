import { NextResponse } from "next/server";
import type OpenAI from "openai";
import { openai, OPENAI_MODEL } from "@/lib/openai/client";
import type { ChatMessage } from "@/core/domain/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Kamu adalah "BodyFit Coach", pelatih nutrisi & kebugaran berbahasa Indonesia.
Gaya: ringkas, membumi, suportif, berbasis bukti. Hindari klaim medis berlebihan.
Konteks: pengguna Indonesia — gunakan contoh makanan lokal (nasi, ayam, tempe, tahu, telur, ikan, sayur) dan satuan metrik.
Selalu: berikan angka konkret bila relevan (kalori, protein), dan 1 langkah aksi praktis.
Jika pengguna menyebut kondisi medis serius, sarankan konsultasi tenaga kesehatan.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY belum diset di environment." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as { messages?: ChatMessage[]; profileSummary?: string };
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    if (incoming.length === 0) {
      return NextResponse.json({ error: "messages kosong." }, { status: 400 });
    }

    const system = body.profileSummary
      ? `${SYSTEM_PROMPT}\n\nProfil pengguna: ${body.profileSummary}`
      : SYSTEM_PROMPT;

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...incoming.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.6,
      max_tokens: 700,
      messages: chatMessages,
    });

    const reply = completion.choices[0]?.message?.content ?? "Maaf, terjadi kesalahan.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/nutrition]", err);
    return NextResponse.json(
      { error: "Gagal memproses permintaan AI." },
      { status: 500 }
    );
  }
}
