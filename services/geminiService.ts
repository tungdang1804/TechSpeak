
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { GameRound, GameChoice } from "../types";

const createAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "AIzaSy...") return null;
  return new GoogleGenAI({ apiKey });
};

// --- Star Detective AI Generator ---

export const generateGameRounds = async (choices: GameChoice[]): Promise<GameRound[]> => {
  const ai = createAIClient();
  if (!ai) return [];

  const choicesContext = choices.map(c => `[ID: ${c.id}, Category: ${c.category}, Label: ${c.label}]`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a customer at Star Spa (a luxury nail salon). 
        Create 5 unique and realistic requests. 
        Each request must include a mix of 2-3 items from these available choices: ${choicesContext}.
        
        Return a JSON ARRAY of 5 objects:
        {
          "id": "unique_id",
          "audioText": "Natural English sentence of the request",
          "correctIds": ["list", "of", "matching", "ids", "from", "the", "choices"]
        }
      `,
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

    const generated = JSON.parse(response.text);
    // Map back to GameRound format by injecting the choices
    return generated.map((g: any) => ({
      ...g,
      choices: choices // Re-use the full menu for each round to keep it challenging
    }));
  } catch (error) {
    console.error("Game Generation Error:", error);
    return [];
  }
};

// --- Pronunciation Assessment ---
// ... (giữ nguyên code cũ)
export interface PronunciationResult {
  score: number;
  feedback: string;
}

export const assessPronunciation = async (audioBase64: string, targetText: string, mimeType: string = 'audio/webm'): Promise<PronunciationResult> => {
  const ai = createAIClient();
  if (!ai) return { score: 0, feedback: "Lỗi: Chưa cấu hình API Key." };
  const effectiveMimeType = mimeType && mimeType.trim() !== '' ? mimeType : 'audio/webm';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: effectiveMimeType, data: audioBase64 } },
          { text: `Evaluate the pronunciation of "${targetText}". Return JSON: {score: 0-100, feedback: "Vietnamese feedback"}` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } },
          required: ["score", "feedback"]
        }
      }
    });
    return JSON.parse(response.text) as PronunciationResult;
  } catch (error) {
    console.error("Pronunciation Check Error:", error);
    return { score: 0, feedback: "Lỗi kết nối AI." };
  }
};

// ... (giữ nguyên code roleplay cũ)
export interface RoleplayTurnResponse {
  ai_response: string;
  user_transcript: string;
  score: number;
  feedback: string;
  satisfaction: number;
  is_finished: boolean;
}

export const createRoleplaySession = (context: string) => {
  const ai = createAIClient();
  if (!ai) return null;
  const systemInstruction = `You are a character in a Technical Workplace setting. Context: ${context}. Interaction Rules: 1. Communicate naturally. 2. Evaluate user's technical accuracy, politeness, and clarity. 3. Include a "satisfaction" score (0-100). 4. Feedback must be in Vietnamese. 5. Occasionally introduce "random variables" to test flexibility.`;
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { ai_response: { type: Type.STRING }, user_transcript: { type: Type.STRING }, score: { type: Type.INTEGER }, feedback: { type: Type.STRING }, satisfaction: { type: Type.INTEGER }, is_finished: { type: Type.BOOLEAN } },
        required: ["ai_response", "user_transcript", "score", "feedback", "satisfaction", "is_finished"]
      }
    },
  });
};

export const sendRoleplayMessage = async (chat: Chat, audioBase64: string | null, textInput: string | null, mimeType: string = 'audio/webm'): Promise<RoleplayTurnResponse> => {
  try {
    const parts: any[] = [];
    const effectiveMimeType = mimeType && mimeType.trim() !== '' ? mimeType : 'audio/webm';
    if (audioBase64) parts.push({ inlineData: { mimeType: effectiveMimeType, data: audioBase64 } });
    if (textInput) parts.push({ text: textInput });
    if (parts.length === 0) parts.push({ text: "Start roleplay." });
    const result = await chat.sendMessage({ message: parts });
    return JSON.parse(result.text) as RoleplayTurnResponse;
  } catch (error) {
    console.error("Roleplay API Error:", error);
    return { ai_response: "Lỗi kết nối.", user_transcript: "", score: 0, feedback: "Lỗi AI.", satisfaction: 50, is_finished: false };
  }
};
