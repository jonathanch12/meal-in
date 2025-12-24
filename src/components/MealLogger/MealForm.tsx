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
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="relative p-[2px] rounded-2xl animate-border">
        <div className="relative flex gap-3 bg-white rounded-2xl overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'Grilled chicken and rice'"
            disabled={isLoading}
            className="flex-1 px-6 py-4 text-base bg-white text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:active:scale-100 mr-2 my-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              "Log"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};