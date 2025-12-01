import React, { useState } from "react";

interface MealFormProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
}

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await onSubmit(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 'Steak and potatoes'"
        style={{ flex: 1, padding: "10px", fontSize: "16px" }}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isLoading ? "..." : "Log"}
      </button>
    </form>
  );
};
