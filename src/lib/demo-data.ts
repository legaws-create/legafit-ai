import type { Profile, Workout, ProgressLog } from "@/core/domain/types";

/**
 * Demo data so every screen renders immediately on first run.
 * Replace these reads with Supabase queries (see README → "Wiring data").
 */

export const demoProfile: Profile = {
  id: "demo-user",
  fullName: "Atlet Demo",
  sex: "male",
  birthYear: 1996,
  heightCm: 174,
  weightKg: 78,
  activityLevel: "moderate",
  goal: "lose",
  createdAt: new Date().toISOString(),
};

export const demoWorkouts: Workout[] = [
  {
    id: "w1",
    ownerId: "demo-user",
    performedAt: daysAgo(1),
    title: "Push Day",
    durationMin: 58,
    notes: null,
    exercises: [
      { name: "Bench Press", sets: [
        { reps: 8, weightKg: 70 }, { reps: 8, weightKg: 70 }, { reps: 6, weightKg: 75 },
      ] },
      { name: "Overhead Press", sets: [
        { reps: 10, weightKg: 40 }, { reps: 9, weightKg: 40 },
      ] },
    ],
  },
  {
    id: "w2",
    ownerId: "demo-user",
    performedAt: daysAgo(3),
    title: "Pull Day",
    durationMin: 52,
    notes: null,
    exercises: [
      { name: "Deadlift", sets: [{ reps: 5, weightKg: 120 }, { reps: 5, weightKg: 120 }] },
      { name: "Barbell Row", sets: [{ reps: 10, weightKg: 60 }, { reps: 10, weightKg: 60 }] },
    ],
  },
  {
    id: "w3",
    ownerId: "demo-user",
    performedAt: daysAgo(8),
    title: "Leg Day",
    durationMin: 64,
    notes: null,
    exercises: [
      { name: "Squat", sets: [{ reps: 6, weightKg: 100 }, { reps: 6, weightKg: 100 }, { reps: 6, weightKg: 105 }] },
    ],
  },
];

export const demoProgress: ProgressLog[] = [
  { id: "p1", ownerId: "demo-user", loggedAt: daysAgo(28), weightKg: 81.2, bodyFatPct: 19.5, waistCm: 88 },
  { id: "p2", ownerId: "demo-user", loggedAt: daysAgo(21), weightKg: 80.4, bodyFatPct: 19.0, waistCm: 87 },
  { id: "p3", ownerId: "demo-user", loggedAt: daysAgo(14), weightKg: 79.6, bodyFatPct: 18.4, waistCm: 86 },
  { id: "p4", ownerId: "demo-user", loggedAt: daysAgo(7), weightKg: 78.8, bodyFatPct: 18.0, waistCm: 85 },
  { id: "p5", ownerId: "demo-user", loggedAt: daysAgo(0), weightKg: 78.0, bodyFatPct: 17.6, waistCm: 84 },
];

/** Calories consumed today (demo) vs target ring. */
export const demoIntakeToday = 1480;

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
