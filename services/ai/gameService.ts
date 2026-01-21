
import { Type } from "@google/genai";
import { createAIClient } from "./base";
import { auth } from "../firebase";
import { getUsageStatus, recordUsage } from "../usageService";
import { generateEventContext, BasketType } from "../eventService";
import { GameRound } from "../../types";

export const generateGameRounds = async (industryId: string, basketType: BasketType = 'Mixed'): Promise<GameRound[]> => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  if (usage.isExceeded) return [];

  const { choices, prompt } = generateEventContext(industryId, basketType);
  const choicesContext = choices.map(c => `{id: "${c.id}", label: "${c.label}"}`).join(', ');

  const ai = createAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 challenges for a professional environment. 
      Context: ${prompt}.
      Strictly use ONLY these IDs for correctIds: [${choicesContext}].
      The response must be a JSON array of 5 objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              audioText: { type: Type.STRING },
              correctIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "audioText", "correctIds"]
          }
        }
      }
    });
    recordUsage(uid);
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Game Generation Error:", error);
    return [];
  }
};
