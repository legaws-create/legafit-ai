/**
 * Core domain types — framework-agnostic.
 * Nothing in here imports React, Next, Supabase, or OpenAI.
 * The rest of the app depends on these; this layer depends on nothing.
 */

export type UUID = string;
export type ISODate = string;

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";
export type Goal = "lose" | "maintain" | "gain";

export interface Profile {
  id: UUID;
  fullName: string | null;
  sex: Sex | null;
  birthYear: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel;
  goal: Goal;
  createdAt: ISODate;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/* ---------- Nutrition / Meals ---------- */

export interface FoodItem {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  id: UUID;
  /** breakfast | lunch | dinner | snack — kept open for Indonesian meal naming */
  slot: "sarapan" | "makan_siang" | "makan_malam" | "camilan";
  title: string;
  items: FoodItem[];
  totalCalories: number;
}

export interface MealPlanDay {
  day: number; // 1..7
  meals: Meal[];
  totalCalories: number;
}

export interface MealPlan {
  id: UUID;
  ownerId: UUID;
  title: string;
  targets: MacroTargets;
  days: MealPlanDay[];
  createdAt: ISODate;
}

/* ---------- Gym ---------- */

export interface ExerciseSet {
  reps: number;
  weightKg: number;
  rpe?: number;
}

export interface WorkoutExercise {
  name: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: UUID;
  ownerId: UUID;
  performedAt: ISODate;
  title: string;
  exercises: WorkoutExercise[];
  durationMin: number | null;
  notes: string | null;
}

/* ---------- Progress ---------- */

export interface ProgressLog {
  id: UUID;
  ownerId: UUID;
  loggedAt: ISODate;
  weightKg: number | null;
  bodyFatPct: number | null;
  waistCm: number | null;
}

/* ---------- Strava ---------- */

export interface StravaActivity {
  id: number;
  name: string;
  type: string; // Run, Ride, Workout, ...
  distanceM: number;
  movingTimeSec: number;
  startDate: ISODate;
  calories: number | null;
}

/* ---------- AI chat ---------- */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
