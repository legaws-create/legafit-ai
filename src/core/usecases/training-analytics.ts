/**
 * Pure training analytics. No I/O.
 */
import type { Workout, WorkoutExercise } from "@/core/domain/types";

/** Estimated 1-rep max via Epley formula. */
export function estimatedOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30));
}

/** Total training volume (kg) for one exercise: sum of weight × reps. */
export function exerciseVolume(ex: WorkoutExercise): number {
  return ex.sets.reduce((acc, s) => acc + s.weightKg * s.reps, 0);
}

/** Total training volume (kg) for a whole workout. */
export function workoutVolume(workout: Workout): number {
  return workout.exercises.reduce((acc, ex) => acc + exerciseVolume(ex), 0);
}

/** Group workouts by ISO week key (e.g. "2026-W23") and sum volume. */
export function weeklyVolume(workouts: Workout[]): { week: string; volume: number }[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    const key = isoWeekKey(new Date(w.performedAt));
    map.set(key, (map.get(key) ?? 0) + workoutVolume(w));
  }
  return [...map.entries()]
    .map(([week, volume]) => ({ week, volume }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
