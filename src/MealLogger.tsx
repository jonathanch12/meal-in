import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

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

  useEffect(() => {
    const savedLogs = localStorage.getItem("mealLogs");
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        const hydratedLogs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(hydratedLogs);
      } catch (e) {
        console.error("Failed to load local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mealLogs", JSON.stringify(logs));
  }, [logs]);

  const handleDelete = (id: number) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const fetchNutritionFromGemini = async (
    text: string
  ): Promise<FoodItem[]> => {
    console.log("--- AI Request Started ---");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
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

      let jsonText = response.text;
      if (!jsonText && response.candidates && response.candidates.length > 0) {
        const firstCandidate = response.candidates[0];
        if (
          firstCandidate.content &&
          firstCandidate.content.parts &&
          firstCandidate.content.parts.length > 0
        ) {
          jsonText = firstCandidate.content.parts[0].text;
        }
      }

      if (!jsonText) throw new Error("No text in response");
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Gemini Error:", error);
      alert(`Failed to process: ${(error as Error).message}`);
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
      console.error("App Logic Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        fontFamily: "Doto",
        width: "450px",
      }}
    >
      <h1>MEAL.in</h1>
      <p>Draft Info</p>

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

      <form
        onSubmit={handleLogMeal}
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
              onClick={() => {
                if (confirm("Clear all history?")) setLogs([]);
              }}
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
          <div
            key={log.id}
            style={{
              position: "relative",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <button
              onClick={() => handleDelete(log.id)}
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
