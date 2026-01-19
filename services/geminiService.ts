
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { GameRound, GameChoice } from "../types";

// Define the response shape for roleplay turns
export interface RoleplayTurnResponse {
  ai_response: string;
  user_transcript: string;
  score: number;
  feedback: string;
  satisfaction: number;
  is_finished: boolean;
}

export interface RoleplaySummary {
  overall_evaluation: string;
  strengths: string[];
  improvements: { word: string; reason: string }[];
  professional_rating: number;
}

// Helper to create AI client using process.env.API_KEY directly
const createAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const generateGameRounds = async (choices: GameChoice[]): Promise<GameRound[]> => {
  const ai = createAIClient();

  const choicesContext = choices.map(c => `[ID: ${c.id}, Category: ${c.category}, Label: ${c.label}]`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an AI creating English listening challenges for a Nail Salon app.
        Generate 5 rounds. Each round must belong to ONE of these categories:
        - BOOKING (Time, people)
        - TECHNICAL (Shape, style, tools)
        - ASSISTANCE (Helping coworkers)
        - PAYMENT (Price, tip, method)
        
        CRITICAL RULES:
        1. The 'correctIds' MUST match the KEYWORDS mentioned in the 'audioText'. 
        2. If the customer says "Not today, maybe tomorrow", only 'tomorrow' is a correct ID.
        3. Use ONLY IDs provided in this list: ${choicesContext}.
        
        Return a JSON ARRAY of 5 objects:
        {
          "id": "round_index",
          "category": "The category name",
          "audioText": "A natural, realistic English sentence",
          "correctIds": ["list", "of", "matching", "ids"]
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
              category: { type: Type.STRING },
              audioText: { type: Type.STRING },
              correctIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "category", "audioText", "correctIds"]
          }
        }
      }
    });

    const generated = JSON.parse(response.text || '[]');
    return generated.map((g: any) => ({
      ...g,
      choices: choices 
    }));
  } catch (error) {
    console.error("Game Generation Error:", error);
    return [];
  }
};

export interface PronunciationResult {
  score: number;
  feedback: string;
}

export const assessPronunciation = async (audioBase64: string, targetText: string, mimeType: string = 'audio/webm'): Promise<PronunciationResult> => {
  const ai = createAIClient();
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
    return JSON.parse(response.text || '{"score": 0, "feedback": "No response"}') as PronunciationResult;
  } catch (error) {
    console.error("Pronunciation Check Error:", error);
    return { score: 0, feedback: "Lỗi kết nối AI." };
  }
};

export const createRoleplaySession = (context: string) => {
  const ai = createAIClient();
  const systemInstruction = `You are a character in a Technical Workplace setting. Context: ${context}. Interaction Rules: 1. Communicate naturally. 2. Evaluate user's technical accuracy, politeness, and clarity. 3. Include a "satisfaction" score (0-100). 4. Feedback must be in Vietnamese. 5. Occasionally introduce "random variables" to test flexibility. If the session goal is met, set is_finished to true.`;
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
    return JSON.parse(result.text || '{}') as RoleplayTurnResponse;
  } catch (error) {
    console.error("Roleplay API Error:", error);
    return { ai_response: "Lỗi kết nối.", user_transcript: "", score: 0, feedback: "Lỗi AI.", satisfaction: 50, is_finished: false };
  }
};

export const analyzeConversationHistory = async (history: { role: string; text: string }[]): Promise<RoleplaySummary> => {
  const ai = createAIClient();
  const conversationText = history.map(h => `${h.role}: ${h.text}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze this Technical English Roleplay session for a Nail Salon staff.
        Conversation history:
        ${conversationText}

        Evaluation Rules:
        1. Evaluate based on Professionalism, Politeness, and Technical Accuracy.
        2. Identify 3 specific English words or phrases the user struggled with or could improve.
        3. All feedback must be in Vietnamese.

        Return JSON in this format:
        {
          "overall_evaluation": "Summary of the whole session",
          "strengths": ["list", "of", "strengths"],
          "improvements": [
            {"word": "word or phrase", "reason": "why they need to improve it"}
          ],
          "professional_rating": 0-100
        }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall_evaluation: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["word", "reason"]
              }
            },
            professional_rating: { type: Type.INTEGER }
          },
          required: ["overall_evaluation", "strengths", "improvements", "professional_rating"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as RoleplaySummary;
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      overall_evaluation: "Không thể phân tích dữ liệu lúc này.",
      strengths: [],
      improvements: [],
      professional_rating: 0
    };
  }
};
