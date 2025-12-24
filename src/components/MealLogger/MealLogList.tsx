// src/components/MealLogger/MealLogList.tsx

import React from "react";
import type { MealLog } from "../../types/meal.types";
import { MealLogItem } from "./MealLogItem";

interface MealLogListProps {
  logs: MealLog[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

export const MealLogList: React.FC<MealLogListProps> = ({
  logs,
  onDelete,
  onClearAll,
}) => {
  const handleClearAll = () => {
    if (confirm("Clear all history?")) {
      onClearAll();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {logs.length > 0 ? `Recent Meals (${logs.length})` : "Your Meals"}
        </h2>
        {logs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 font-medium">No meals logged yet</p>
            <p className="text-sm text-gray-400">Start by entering your first meal above</p>
          </div>
        </div>
      )}

      {logs.map((log) => (
        <MealLogItem key={log.id} log={log} onDelete={onDelete} />
      ))}
    </div>
  );
};