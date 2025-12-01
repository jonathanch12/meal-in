import React from "react";
import type { MealLog } from "../../types/meal.types.ts";
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {logs.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              fontSize: "0.8rem",
              color: "red",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {logs.length === 0 && <p style={{ color: "#888" }}>No logs yet.</p>}

      {logs.map((log) => (
        <MealLogItem key={log.id} log={log} onDelete={onDelete} />
      ))}
    </div>
  );
};
