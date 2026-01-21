
import { Type } from "@google/genai";
import { createAIClient } from "./base";
import { Vocabulary } from "../../types";

export const fetchWordDetail = async (word: string): Promise<Partial<Vocabulary>> => {
  const ai = createAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Define the English word/phrase: "${word}" in the context of Technical Nail/Beauty services. 
      Return JSON with: translation (Vietnamese), definition (short Vietnamese), ipa, and a short exampleSentence.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            definition: { type: Type.STRING },
            ipa: { type: Type.STRING },
            exampleSentence: { type: Type.STRING }
          },
          required: ["translation", "definition", "ipa"]
        }
      }
    });
    const data = JSON.parse(response.text || '{}');
    return { ...data, word, id: `ai_${Date.now()}` };
  } catch (error) {
    console.error("AI Dictionary Error:", error);
    return { word, translation: "Không thể tra cứu", ipa: "/.../" };
  }
};
