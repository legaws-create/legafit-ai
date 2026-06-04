import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatRing } from "@/components/ui/StatRing";
import { BarChart, LineChart } from "@/components/charts/Charts";
import { IconArrowRight, IconSpark, IconMeal } from "@/components/ui/icons";
import { macroTargetsFromProfile } from "@/core/domain/nutrition";
import { weeklyVolume } from "@/core/usecases/training-analytics";
import {
  demoProfile,
  demoWorkouts,
  demoProgress,
  demoIntakeToday,
} from "@/lib/demo-data";
import { fmt } from "@/lib/utils";

export default function DashboardPage() {
  // Pure domain calculations — same code path will run on real Supabase data.
  const targets = macroTargetsFromProfile(demoProfile)!;
  const weekly = weeklyVolume(demoWorkouts).slice(-5);
  const weights = demoProgress.map((p) => p.weightKg ?? 0);
  const lost = (weights[0] - weights[weights.length - 1]).toFixed(1);

  const macroBars = [
    { label: "Protein", value: targets.proteinG, unit: "g", color: "#C7F551" },
    { label: "Karbo", value: targets.carbsG, unit: "g", color: "#FF6B35" },
    { label: "Lemak", value: targets.fatG, unit: "g", color: "#7DD3FC" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Selamat datang kembali" title="Ringkasan Hari Ini" />

      {/* Calorie ring */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "40ms" }}>
        <div className="flex items-center gap-5">
          <StatRing
            value={demoIntakeToday}
            max={targets.calories}
            label="dari"
            sublabel={fmt.kcal(targets.calories)}
          />
          <div className="flex-1 space-y-3">
            {macroBars.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-chalk-muted">{m.label}</span>
                  <span className="num text-chalk">
                    {m.value}
                    {m.unit}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (demoIntakeToday / targets.calories) * 100)}%`,
                      background: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <Link href="/nutrition" className="card group flex flex-col gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime/15 text-lime">
            <IconSpark className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-semibold text-chalk">Tanya Coach AI</p>
            <p className="text-xs text-chalk-faint">Nutrisi & strategi latihan</p>
          </div>
        </Link>
        <Link href="/meals" className="card group flex flex-col gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ember/15 text-ember">
            <IconMeal className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-semibold text-chalk">Buat Menu</p>
            <p className="text-xs text-chalk-faint">Meal plan khas Indonesia</p>
          </div>
        </Link>
      </section>

      {/* Weekly training volume */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "120ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label">Volume Latihan</p>
            <p className="font-display text-lg font-bold text-chalk">Per Minggu (kg)</p>
          </div>
          <Link href="/gym" className="text-chalk-faint transition hover:text-lime">
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <BarChart data={weekly.map((w) => ({ label: w.week.split("-W")[1], value: w.volume }))} />
      </section>

      {/* Weight trend */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "160ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="label">Berat Badan</p>
            <p className="font-display text-lg font-bold text-chalk">Tren 4 Minggu</p>
          </div>
          <span className="pill bg-lime/15 text-lime">↓ {lost} kg</span>
        </div>
        <LineChart data={weights} />
      </section>
    </div>
  );
}
