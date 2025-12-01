import type { MealLog } from "../types/meal.types.ts";

export const calculateTotalCalories = (logs: MealLog[]): number => {
  return logs
    .flatMap((log) => log.items)
    .reduce((acc, curr) => acc + curr.calories, 0);
};

export const calculateTotalProtein = (logs: MealLog[]): number => {
  return logs
    .flatMap((log) => log.items)
    .reduce((acc, curr) => acc + curr.protein, 0);
};
