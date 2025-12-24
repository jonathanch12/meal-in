import React from "react";

interface NutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  totalCalories,
  totalProtein,
}) => {
  return (
    <div className="flex gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium mb-1">Calories</span>
        <span className="text-3xl font-bold text-gray-900">{totalCalories}</span>
      </div>
      <div className="w-px bg-gray-300"></div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium mb-1">Protein</span>
        <span className="text-3xl font-bold text-gray-900">{totalProtein}g</span>
      </div>
    </div>
  );
};