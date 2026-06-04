"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { macroTargetsFromProfile } from "@/core/domain/nutrition";
import { demoProfile } from "@/lib/demo-data";
import { fmt } from "@/lib/utils";
import type { MealPlanDay } from "@/core/domain/types";

const SLOT_LABEL: Record<string, string> = {
  sarapan: "Sarapan",
  makan_siang: "Makan Siang",
  makan_malam: "Makan Malam",
  camilan: "Camilan",
};

export default function MealsPage() {
  const targets = macroTargetsFromProfile(demoProfile)!;
  const [days, setDays] = useState(3);
  const [prefs, setPrefs] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlanDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/meals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, targets, preferences: prefs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat menu.");
      setPlan(data.plan?.days ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Meal Planner" title="Menu Indonesia" />

      <section className="card space-y-4 p-5 animate-fade-up">
        <div>
          <p className="label mb-2">Target harian</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="pill bg-lime/15 text-lime">{fmt.kcal(targets.calories)}</span>
            <span className="pill bg-white/5 text-chalk-muted">P {targets.proteinG}g</span>
            <span className="pill bg-white/5 text-chalk-muted">K {targets.carbsG}g</span>
            <span className="pill bg-white/5 text-chalk-muted">L {targets.fatG}g</span>
          </div>
        </div>

        <div>
          <p className="label mb-2">Jumlah hari</p>
          <div className="flex gap-2">
            {[1, 3, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={
                  "flex-1 rounded-2xl py-2.5 text-sm font-medium transition " +
                  (days === d ? "bg-lime text-ink" : "bg-ink-700 text-chalk-muted hover:text-chalk")
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label mb-2">Preferensi (opsional)</p>
          <input
            value={prefs}
            onChange={(e) => setPrefs(e.target.value)}
            placeholder="cth: suka pedas, budget hemat, tanpa seafood"
            className="input"
          />
        </div>

        <button onClick={generate} disabled={loading} className="btn-primary w-full">
          {loading ? "Menyusun menu…" : "Buat Rencana Makan"}
        </button>
        {error && <p className="text-sm text-ember">{error}</p>}
      </section>

      {plan?.map((day) => (
        <section key={day.day} className="card p-5 animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-chalk">Hari {day.day}</h2>
            {day.totalCalories > 0 && (
              <span className="pill bg-lime/15 text-lime">{fmt.kcal(day.totalCalories)}</span>
            )}
          </div>
          <div className="space-y-3">
            {day.meals.map((meal, i) => (
              <div key={i} className="rounded-2xl bg-ink-700/60 p-3.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="label text-ember">{SLOT_LABEL[meal.slot] ?? meal.slot}</span>
                  <span className="num text-xs text-chalk-muted">{fmt.kcal(meal.totalCalories)}</span>
                </div>
                <p className="font-medium text-chalk">{meal.title}</p>
                {meal.items?.length > 0 && (
                  <p className="mt-1 text-xs text-chalk-faint">
                    {meal.items.map((it) => it.name).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
