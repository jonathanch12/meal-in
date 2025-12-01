import React from "react";
import type { MealLog } from "../../types/meal.types.ts";

interface MealLogItemProps {
  log: MealLog;
  onDelete: (id: number) => void;
}

export const MealLogItem: React.FC<MealLogItemProps> = ({ log, onDelete }) => {
  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <button
        onClick={() => onDelete(log.id)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#999",
        }}
        title="Delete this entry"
      >
        ✕
      </button>

      <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "5px" }}>
        {log.timestamp.toLocaleTimeString()} — <em>"{log.originalText}"</em>
      </div>

      <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
        {log.items.map((item, idx) => (
          <li key={idx}>
            <strong>{item.item}</strong>: {item.calories} cal, {item.protein}g
            protein
          </li>
        ))}
      </ul>
    </div>
  );
};
