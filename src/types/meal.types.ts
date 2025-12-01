export interface FoodItem {
  item: string;
  calories: number;
  protein: number;
}

export interface MealLog {
  id: number;
  timestamp: Date;
  originalText: string;
  items: FoodItem[];
}
