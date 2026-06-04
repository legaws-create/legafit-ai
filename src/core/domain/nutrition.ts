/**
 * Pure nutrition logic. No I/O, no framework. Deterministic and testable.
 * Uses Mifflin–St Jeor for BMR and standard activity multipliers for TDEE.
 */
import type {
  ActivityLevel,
  Goal,
  MacroTargets,
  Profile,
  Sex,
} from "@/core/domain/types";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

const GOAL_DELTA: Record<Goal, number> = {
  lose: -0.2, // 20% deficit
  maintain: 0,
  gain: 0.12, // 12% surplus
};

export function ageFromBirthYear(birthYear: number, now = new Date()): number {
  return Math.max(0, now.getFullYear() - birthYear);
}

/** Mifflin–St Jeor basal metabolic rate (kcal/day). */
export function basalMetabolicRate(input: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const { sex, weightKg, heightCm, age } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

export function totalDailyEnergyExpenditure(
  bmr: number,
  activity: ActivityLevel
): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activity]);
}

/**
 * Compute calorie + macro targets from a profile.
 * Protein anchored at 1.8 g/kg (good for body recomposition), fat at 25% of
 * calories, remainder to carbs. Returns null if the profile is incomplete.
 */
export function macroTargetsFromProfile(profile: Profile): MacroTargets | null {
  const { sex, weightKg, heightCm, birthYear } = profile;
  if (!sex || !weightKg || !heightCm || !birthYear) return null;

  const age = ageFromBirthYear(birthYear);
  const bmr = basalMetabolicRate({ sex, weightKg, heightCm, age });
  const tdee = totalDailyEnergyExpenditure(bmr, profile.activityLevel);
  const calories = Math.round(tdee * (1 + GOAL_DELTA[profile.goal]));

  const proteinG = Math.round(1.8 * weightKg);
  const fatG = Math.round((calories * 0.25) / 9);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbsG = Math.max(0, Math.round((calories - proteinKcal - fatKcal) / 4));

  return { calories, proteinG, carbsG, fatG };
}

/** Sum macros from a list of items into a single MacroTargets shape. */
export function sumMacros(
  items: { calories: number; proteinG: number; carbsG: number; fatG: number }[]
): MacroTargets {
  return items.reduce<MacroTargets>(
    (acc, i) => ({
      calories: acc.calories + i.calories,
      proteinG: acc.proteinG + i.proteinG,
      carbsG: acc.carbsG + i.carbsG,
      fatG: acc.fatG + i.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}
