import { GoogleGenAI } from "@google/genai";
import type { FoodItem } from "../types/meal.types.ts";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

export const fetchNutritionFromGemini = async (
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

    if (!jsonText) {
      throw new Error("No text in response");
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(`Failed to process: ${(error as Error).message}`);
  }
};
