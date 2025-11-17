import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Initialize the NEW SDK
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

interface FoodItem {
  item: string;
  calories: number;
  protein: number;
}

interface MealLog {
  id: number;
  timestamp: Date;
  originalText: string;
  items: FoodItem[];
}

const MealLogger: React.FC = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<MealLog[]>([]);

  const fetchNutritionFromGemini = async (
    text: string
  ): Promise<FoodItem[]> => {
    console.log("--- Starting AI Request ---");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          // We define the schema to ensure strict JSON output
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                item: { type: "STRING" },
                calories: { type: "NUMBER" },
                protein: { type: "NUMBER" },
              },
              required: ["item", "calories", "protein"],
            },
          },
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this meal and return a JSON array of food items with estimated calories and protein (g). Input: "${text}"`,
              },
            ],
          },
        ],
      });

      // DEBUGGING: Log the raw response object
      console.log("Raw AI Response Object:", response);

      // Method A: Standard SDK Helper
      let jsonText = response.text;

      // Method B: Manual Fallback (if Method A fails/returns null)
      if (!jsonText && response.candidates && response.candidates.length > 0) {
        console.warn("Standard .text() was empty, trying manual extraction...");
        const candidate = response.candidates[0];
        // Safely access the nested structure
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          jsonText = candidate.content.parts[0].text;
        }
      }

      console.log("Extracted JSON Text:", jsonText);

      if (!jsonText) {
        console.error("Fatal: Could not extract text from AI response.");
        return [];
      }

      const parsedData = JSON.parse(jsonText);
      console.log("Parsed Data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Detailed Gemini Error:", error);
      return [];
    }
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const items = await fetchNutritionFromGemini(input);

      if (!items || items.length === 0) {
        // This is the error you were seeing
        alert(
          "I couldn't identify any food. Check the Console (F12) for the raw error."
        );
        setIsLoading(false);
        return;
      }

      const newLog: MealLog = {
        id: Date.now(),
        timestamp: new Date(),
        originalText: input,
        items: items,
      };

      setLogs([newLog, ...logs]);
      setInput("");
    } catch (error) {
      console.error("App Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Calculations and UI (Standard) ---
  const totalCalories = logs
    .flatMap((log) => log.items)
    .reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = logs
    .flatMap((log) => log.items)
    .reduce((acc, curr) => acc + curr.protein, 0);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Smart Meal Logger (v2) ♊</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "15px",
          background: "#f0f9ff",
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

      <form
        onSubmit={handleLogMeal}
        style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 'Chicken breast and rice'"
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
          {isLoading ? "Thinking..." : "Log It"}
        </button>
      </form>

      <div>
        <h3>History</h3>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{ fontSize: "0.9em", color: "#666", marginBottom: "5px" }}
            >
              {log.timestamp.toLocaleTimeString()} —{" "}
              <em>"{log.originalText}"</em>
            </div>
            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
              {log.items.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.item}</strong>: {item.calories} cal,{" "}
                  {item.protein}g protein
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealLogger;
