
import { Type } from "@google/genai";
import { createAIClient } from "../base";

/**
 * AI Assessment Engine
 * Chuyên trách tương tác trực tiếp với model Gemini Flash
 */

export const callPronunciationAPI = async (audioBase64: string, targetText: string, mimeType: string) => {
  const ai = createAIClient();
  return await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType, data: audioBase64 } },
        { text: `Evaluate pronunciation of "${targetText}". Return JSON {score: 0-100, feedback: "Vietnamese"}` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { 
          score: { type: Type.INTEGER }, 
          feedback: { type: Type.STRING } 
        },
        required: ["score", "feedback"]
      }
    }
  });
};
