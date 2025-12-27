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

export interface MealInput {
  text?: string;
  image?: File;
}

export interface PendingMeal {
  input: MealInput;
  items: FoodItem[];
  imagePreview?: string;
}