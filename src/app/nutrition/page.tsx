"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { IconSend } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/core/domain/types";

const SUGGESTIONS = [
  "Menu tinggi protein budget warteg?",
  "Cara defisit kalori tanpa lapar?",
  "Apakah nasi merah lebih baik?",
];

export default function NutritionPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Aku LegaFit AI Coach. Tanya apa saja soal nutrisi, target kalori, atau strategi latihan — aku jawab pakai konteks makanan Indonesia. 🍱",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content } as ChatMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply: string = data.reply ?? data.error ?? "Maaf, terjadi kesalahan.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Gagal terhubung. Periksa koneksi lalu coba lagi." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
      );
    }
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col">
      <PageHeader eyebrow="Bertenaga AI" title="Nutrition Coach" />

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3 no-scrollbar">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex animate-fade-up", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-br-md bg-lime text-ink"
                  : "rounded-bl-md bg-ink-700 text-chalk"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-3xl rounded-bl-md bg-ink-700 px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-chalk-muted"
                  style={{ animationDelay: `${d * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="pill shrink-0 border border-white/10 text-chalk-muted transition hover:border-lime/40 hover:text-chalk"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Tulis pertanyaan…"
          className="input max-h-32 flex-1 resize-none"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          aria-label="Kirim"
          className="btn-primary aspect-square !px-0 !py-0 h-12 w-12"
        >
          <IconSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
