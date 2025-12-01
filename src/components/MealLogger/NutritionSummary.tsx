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
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        padding: "15px",
        background: "#383838ff",
        borderRadius: "8px",
      }}
    >
      <div>
        <strong>Calories:</strong> {totalCalories}
      </div>
      <div>
        <strong>Protein:</strong> {totalProtein}g
      </div>
    </div>
  );
};
