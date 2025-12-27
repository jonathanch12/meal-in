import React from "react";
import type { MealLog } from "../../types/meal.types";

interface MealLogItemProps {
  log: MealLog;
  onDelete: (id: number) => void;
}

export const MealLogItem: React.FC<MealLogItemProps> = ({ log, onDelete }) => {
  return (
    <div className="relative group bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:shadow-md transition-all duration-200">
      <button
        onClick={() => onDelete(log.id)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Delete this entry"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 pr-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{log.timestamp.toLocaleTimeString()}</span>
        {log.originalText && (
          <>
            <span className="text-gray-300">•</span>
            <span className="italic text-gray-600">"{log.originalText}"</span>
          </>
        )}
      </div>

      <div className="space-y-2">
        {log.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-0 first:pt-0">
            <span className="font-medium text-gray-900">{item.item}</span>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-semibold">{item.calories}</span> cal
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">{item.protein}g</span> protein
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};