"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LineChart } from "@/components/charts/Charts";
import { IconPlus } from "@/components/ui/icons";
import { demoProgress } from "@/lib/demo-data";
import type { ProgressLog } from "@/core/domain/types";
import { fmt } from "@/lib/utils";

function StravaBanner() {
  const params = useSearchParams();
  const status = params.get("strava");
  if (!status) return null;
  const connected = status === "connected";
  return (
    <div
      className={
        "rounded-2xl px-4 py-3 text-sm animate-fade-up " +
        (connected ? "bg-lime/15 text-lime" : "bg-ember/15 text-ember")
      }
    >
      {connected
        ? "Strava berhasil terhubung. Aktivitasmu akan tersinkron."
        : "Gagal menghubungkan Strava. Coba lagi."}
    </div>
  );
}

export default function ProgressPage() {
  const [logs, setLogs] = useState<ProgressLog[]>(demoProgress);
  const [weight, setWeight] = useState("");

  const weights = logs.map((l) => l.weightKg ?? 0);
  const latest = logs[logs.length - 1];
  const delta = weights.length > 1 ? (weights[weights.length - 1] - weights[0]).toFixed(1) : "0";

  function addLog() {
    const kg = Number(weight);
    if (!kg) return;
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ownerId: "demo-user",
        loggedAt: new Date().toISOString(),
        weightKg: kg,
        bodyFatPct: null,
        waistCm: null,
      },
    ]);
    setWeight("");
    // TODO: persist — supabase.from("progress_logs").insert(...)
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Progress Tracker" title="Progres" />

      <Suspense fallback={null}>
        <StravaBanner />
      </Suspense>

      <section className="card p-5 animate-fade-up">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="label">Berat terkini</p>
            <p className="num text-3xl font-bold text-chalk">{fmt.kg(latest?.weightKg ?? 0)}</p>
          </div>
          <span className={"pill " + (Number(delta) <= 0 ? "bg-lime/15 text-lime" : "bg-ember/15 text-ember")}>
            {Number(delta) <= 0 ? "↓" : "↑"} {Math.abs(Number(delta))} kg
          </span>
        </div>
        <LineChart data={weights} color="#C7F551" />
      </section>

      <section className="card flex gap-2 p-4 animate-fade-up">
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          inputMode="decimal"
          placeholder="Catat berat hari ini (kg)"
          className="input flex-1"
        />
        <button onClick={addLog} className="btn-primary !px-4">
          <IconPlus className="h-5 w-5" />
        </button>
      </section>

      {/* Strava integration */}
      <section className="card p-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-chalk">Strava</p>
            <p className="text-xs text-chalk-faint">Sinkronkan lari & bersepeda otomatis</p>
          </div>
          <a href="/api/strava" className="btn-ghost !py-2.5 text-sm">
            Hubungkan
          </a>
        </div>
      </section>

      <section className="card p-5 animate-fade-up">
        <p className="label mb-3">Riwayat</p>
        <div className="space-y-2">
          {[...logs].reverse().slice(0, 6).map((l) => (
            <div key={l.id} className="flex items-center justify-between text-sm">
              <span className="text-chalk-muted">
                {new Date(l.loggedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </span>
              <span className="num text-chalk">{fmt.kg(l.weightKg ?? 0)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
