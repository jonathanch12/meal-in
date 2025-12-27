import { GoogleGenAI } from "@google/genai";
import type { FoodItem, MealInput } from "../types/meal.types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const fetchNutritionFromGemini = async (
  input: MealInput
): Promise<FoodItem[]> => {
  console.log("--- AI Request Started ---");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];

    let promptText = "Analyze this meal and return a JSON array of food items with estimated calories and protein (g).";

    if (input.image) {
      const base64Image = await fileToBase64(input.image);
      const mimeType = input.image.type;

      console.log("Image MIME type:", mimeType);
      console.log("Base64 length:", base64Image.length);

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      });

      promptText += " Analyze the food in the image.";
    }

    if (input.text) {
      promptText += ` Additional context: "${input.text}"`;
    }

    parts.push({
      text: promptText
    });

    console.log("Sending request with parts:", parts.length);

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
          parts: parts,
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

    const parsedData = JSON.parse(jsonText);
    console.log("AI Response:", parsedData);

    return parsedData;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(`Failed to process: ${(error as Error).message}`);
  }
};