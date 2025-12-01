import React, { useState } from "react";
import { useMealLogs } from "../../hooks/useMealLogs";
import { fetchNutritionFromGemini } from "../../services/geminiServices";
import {
  calculateTotalCalories,
  calculateTotalProtein,
} from "../../utils/nutrition.utils";
import type { MealLog } from "../../types/meal.types";
import { NutritionSummary } from "./NutritionSummary";
import { MealForm } from "./MealForm";
import { MealLogList } from "./MealLogList";

const MealLogger: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logs, addLog, deleteLog, clearAllLogs } = useMealLogs();

  const handleLogMeal = async (input: string) => {
    setIsLoading(true);

    try {
      const items = await fetchNutritionFromGemini(input);

      if (!items || items.length === 0) {
        return;
      }

      const newLog: MealLog = {
        id: Date.now(),
        timestamp: new Date(),
        originalText: input,
        items: items,
      };

      addLog(newLog);
    } catch (error) {
      console.error("Error logging meal:", error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCalories = calculateTotalCalories(logs);
  const totalProtein = calculateTotalProtein(logs);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Doto",
        width: "450px",
      }}
    >
      <h1>MEAL.in</h1>
      <p>Draft Info</p>

      <NutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
      />

      <MealForm onSubmit={handleLogMeal} isLoading={isLoading} />

      <MealLogList logs={logs} onDelete={deleteLog} onClearAll={clearAllLogs} />
    </div>
  );
};

export default MealLogger;
