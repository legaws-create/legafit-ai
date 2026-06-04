"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { IconPlus } from "@/components/ui/icons";
import {
  workoutVolume,
  estimatedOneRepMax,
} from "@/core/usecases/training-analytics";
import { demoWorkouts } from "@/lib/demo-data";
import type { Workout } from "@/core/domain/types";

export default function GymPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(demoWorkouts);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [exName, setExName] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  function addWorkout() {
    if (!title.trim() || !exName.trim()) return;
    const w: Workout = {
      id: crypto.randomUUID(),
      ownerId: "demo-user",
      performedAt: new Date().toISOString(),
      title: title.trim(),
      durationMin: null,
      notes: null,
      exercises: [
        {
          name: exName.trim(),
          sets: [{ reps: Number(reps) || 0, weightKg: Number(weight) || 0 }],
        },
      ],
    };
    setWorkouts((prev) => [w, ...prev]);
    setTitle("");
    setExName("");
    setReps("");
    setWeight("");
    setOpen(false);
    // TODO: persist to Supabase — supabase.from("workouts").insert(...)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Gym Tracker"
        title="Latihan"
        action={
          <button onClick={() => setOpen((o) => !o)} className="btn-primary !px-4 !py-2.5 text-sm">
            <IconPlus className="h-4 w-4" /> Catat
          </button>
        }
      />

      {open && (
        <section className="card space-y-3 p-5 animate-fade-up">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nama sesi (cth: Push Day)" className="input" />
          <input value={exName} onChange={(e) => setExName(e.target.value)} placeholder="Gerakan (cth: Bench Press)" className="input" />
          <div className="flex gap-3">
            <input value={reps} onChange={(e) => setReps(e.target.value)} inputMode="numeric" placeholder="Reps" className="input" />
            <input value={weight} onChange={(e) => setWeight(e.target.value)} inputMode="decimal" placeholder="Beban (kg)" className="input" />
          </div>
          <button onClick={addWorkout} className="btn-primary w-full">Simpan Sesi</button>
        </section>
      )}

      {workouts.map((w) => {
        const vol = workoutVolume(w);
        const topSet = w.exercises[0]?.sets?.[0];
        const e1rm = topSet ? estimatedOneRepMax(topSet.weightKg, topSet.reps) : 0;
        return (
          <section key={w.id} className="card p-5 animate-fade-up">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-chalk">{w.title}</h2>
                <p className="text-xs text-chalk-faint">
                  {new Date(w.performedAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="num text-xl font-bold text-lime">{vol.toLocaleString("id-ID")}</p>
                <p className="label">volume kg</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {w.exercises.map((ex, i) => (
                <div key={i} className="rounded-2xl bg-ink-700/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-chalk">{ex.name}</span>
                    <span className="num text-xs text-chalk-muted">
                      e1RM ≈ {estimatedOneRepMax(ex.sets[0]?.weightKg ?? 0, ex.sets[0]?.reps ?? 0)} kg
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ex.sets.map((s, j) => (
                      <span key={j} className="pill bg-white/5 text-chalk-muted">
                        {s.reps} × {s.weightKg}kg
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
