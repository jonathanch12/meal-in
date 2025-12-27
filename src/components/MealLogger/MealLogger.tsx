import React, { useState } from "react";
import { useMealLogs } from "../../hooks/useMealLogs";
import { fetchNutritionFromGemini } from "../../services/geminiServices";
import { calculateTotalCalories, calculateTotalProtein } from "../../utils/nutrition.utils";
import type { MealLog, MealInput, PendingMeal, FoodItem } from "../../types/meal.types";
import { NutritionSummary } from "./NutritionSummary";
import { MultimodalMealForm } from "./MultimodalMealForm";
import { MealLogList } from "./MealLogList";
import { EditMealModal } from "./EditMealModal";

const MealLogger: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<PendingMeal | null>(null);
  const { logs, addLog, deleteLog, clearAllLogs } = useMealLogs();

  const handleAnalyzeMeal = async (input: MealInput) => {
    setIsLoading(true);

    try {
      const items = await fetchNutritionFromGemini(input);

      if (!items || items.length === 0) {
        alert("No food items detected. Please try again.");
        setIsLoading(false);
        return;
      }

      let imagePreview: string | undefined;
      if (input.image) {
        imagePreview = URL.createObjectURL(input.image);
      }

      setPendingMeal({
        input,
        items,
        imagePreview,
      });

    } catch (error) {
      console.error("Error analyzing meal:", error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMeal = (editedItems: FoodItem[]) => {
    if (!pendingMeal) return;

    const newLog: MealLog = {
      id: Date.now(),
      timestamp: new Date(),
      originalText: pendingMeal.input.text || "Photo upload",
      items: editedItems,
    };

    addLog(newLog);

    if (pendingMeal.imagePreview) {
      URL.revokeObjectURL(pendingMeal.imagePreview);
    }

    setPendingMeal(null);
  };

  const handleCancelEdit = () => {
    if (pendingMeal?.imagePreview) {
      URL.revokeObjectURL(pendingMeal.imagePreview);
    }
    setPendingMeal(null);
  };

  const totalCalories = calculateTotalCalories(logs);
  const totalProtein = calculateTotalProtein(logs);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            MEAL.in
          </h1>
          <p className="text-gray-500 text-sm">Track your nutrition with AI-powered analysis</p>
        </div>

        {/* Nutrition Summary */}
        <NutritionSummary
          totalCalories={totalCalories}
          totalProtein={totalProtein}
        />

        {/* Multimodal Meal Input Form */}
        <MultimodalMealForm
          onSubmit={handleAnalyzeMeal}
          isLoading={isLoading}
        />

        {/* Meal Log List */}
        <MealLogList
          logs={logs}
          onDelete={deleteLog}
          onClearAll={clearAllLogs}
        />
      </div>

      {/* Edit Modal - Image shown here only, then discarded */}
      <EditMealModal
        pendingMeal={pendingMeal}
        onSave={handleSaveMeal}
        onCancel={handleCancelEdit}
      />
    </div>
  );
};

export default MealLogger;