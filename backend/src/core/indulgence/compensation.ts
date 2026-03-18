import { UserIndulgenceItem } from '../../shared/types/user.types';

export interface WeeklyCalorieAdjustment {
  dayOfWeek: number; // 0-6
  adjustmentCalories: number; // negative = calories removed from this day's budget
}

// Calculate how indulgence items affect weekly calorie distribution.
// Weekly compensation: the extra calories are spread across the week,
// NOT penalized per day — only the indulgence day's budget is reduced.
export function computeWeeklyCompensation(
  indulgenceItems: UserIndulgenceItem[],
  _weeklyCalorieTarget: number
): WeeklyCalorieAdjustment[] {
  const dayAdjustments = new Map<number, number>();

  for (const item of indulgenceItems) {
    const current = dayAdjustments.get(item.dayOfWeek) ?? 0;
    dayAdjustments.set(item.dayOfWeek, current + item.weeklyCompensationCalories);
  }

  return Array.from(dayAdjustments.entries()).map(([day, extraCalories]) => ({
    dayOfWeek: day,
    adjustmentCalories: -extraCalories, // day budget reduced by indulgence calories
  }));
}

// Total weekly calories consumed by all indulgence items
export function totalIndulgenceCalories(items: UserIndulgenceItem[]): number {
  return items.reduce((sum, item) => sum + item.weeklyCompensationCalories, 0);
}
