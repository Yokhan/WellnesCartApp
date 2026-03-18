import { computeWeeklyCompensation, totalIndulgenceCalories } from './compensation';
import { UserIndulgenceItem } from '../../shared/types/user.types';

function makeItem(
  overrides: Partial<UserIndulgenceItem> & { dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
): UserIndulgenceItem {
  return {
    id: overrides.id ?? 'item-1',
    userId: overrides.userId ?? 'user-1',
    productId: overrides.productId ?? 'product-1',
    servingG: overrides.servingG ?? 100,
    dayOfWeek: overrides.dayOfWeek,
    mealContext: overrides.mealContext ?? 'cold_snack',
    weeklyCompensationCalories: overrides.weeklyCompensationCalories ?? 200,
    isSacred: overrides.isSacred ?? false,
  };
}

describe('totalIndulgenceCalories', () => {
  it('returns 0 for empty items', () => {
    expect(totalIndulgenceCalories([])).toBe(0);
  });

  it('returns calories of single item', () => {
    const items = [makeItem({ dayOfWeek: 1, weeklyCompensationCalories: 350 })];
    expect(totalIndulgenceCalories(items)).toBe(350);
  });

  it('sums across multiple items', () => {
    const items = [
      makeItem({ dayOfWeek: 1, weeklyCompensationCalories: 200 }),
      makeItem({ id: 'item-2', dayOfWeek: 3, weeklyCompensationCalories: 150 }),
      makeItem({ id: 'item-3', dayOfWeek: 5, weeklyCompensationCalories: 300 }),
    ];
    expect(totalIndulgenceCalories(items)).toBe(650);
  });

  it('sums items on the same day correctly', () => {
    const items = [
      makeItem({ dayOfWeek: 0, weeklyCompensationCalories: 100 }),
      makeItem({ id: 'item-2', dayOfWeek: 0, weeklyCompensationCalories: 150 }),
    ];
    expect(totalIndulgenceCalories(items)).toBe(250);
  });
});

describe('computeWeeklyCompensation', () => {
  const weeklyTarget = 14000; // 2000 kcal/day × 7

  it('returns empty array for no indulgence items', () => {
    const result = computeWeeklyCompensation([], weeklyTarget);
    expect(result).toHaveLength(0);
  });

  it('returns single adjustment for single item', () => {
    const items = [makeItem({ dayOfWeek: 2, weeklyCompensationCalories: 400 })];
    const result = computeWeeklyCompensation(items, weeklyTarget);
    expect(result).toHaveLength(1);
    expect(result[0].dayOfWeek).toBe(2);
    expect(result[0].adjustmentCalories).toBe(-400);
  });

  it('adjustmentCalories is negative (budget reduction)', () => {
    const items = [makeItem({ dayOfWeek: 6, weeklyCompensationCalories: 500 })];
    const result = computeWeeklyCompensation(items, weeklyTarget);
    expect(result[0].adjustmentCalories).toBeLessThan(0);
  });

  it('combines multiple items on the same day into one adjustment', () => {
    const items = [
      makeItem({ dayOfWeek: 1, weeklyCompensationCalories: 200 }),
      makeItem({ id: 'item-2', dayOfWeek: 1, weeklyCompensationCalories: 150 }),
    ];
    const result = computeWeeklyCompensation(items, weeklyTarget);
    expect(result).toHaveLength(1);
    expect(result[0].dayOfWeek).toBe(1);
    expect(result[0].adjustmentCalories).toBe(-350);
  });

  it('produces separate adjustments for items on different days', () => {
    const items = [
      makeItem({ dayOfWeek: 0, weeklyCompensationCalories: 200 }),
      makeItem({ id: 'item-2', dayOfWeek: 4, weeklyCompensationCalories: 300 }),
    ];
    const result = computeWeeklyCompensation(items, weeklyTarget);
    expect(result).toHaveLength(2);
    const days = result.map((r) => r.dayOfWeek).sort();
    expect(days).toEqual([0, 4]);
  });

  it('handles items spread across all 7 days', () => {
    const items = [0, 1, 2, 3, 4, 5, 6].map((day) =>
      makeItem({
        id: `item-${day}`,
        dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        weeklyCompensationCalories: 100,
      })
    );
    const result = computeWeeklyCompensation(items, weeklyTarget);
    expect(result).toHaveLength(7);
    result.forEach((r) => expect(r.adjustmentCalories).toBe(-100));
  });
});
