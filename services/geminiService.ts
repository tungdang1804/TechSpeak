
import { GoogleGenAI, Chat, Type } from "@google/genai";

const createAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Pronunciation Assessment (Single Phrase) ---

interface PronunciationResult {
  score: number;
  feedback: string;
}

export const assessPronunciation = async (audioBase64: string, targetText: string, mimeType: string = 'audio/webm'): Promise<PronunciationResult> => {
  const ai = createAIClient();
  if (!ai) return { score: 0, feedback: "API Key Missing" };

  // Ensure mimeType is not empty
  const effectiveMimeType = mimeType && mimeType.trim() !== '' ? mimeType : 'audio/webm';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: effectiveMimeType,
              data: audioBase64
            }
          },
          {
            text: `You are a TechSpeak Language Expert. Evaluate the pronunciation of this audio against the technical target phrase: "${targetText}". 
            Context: Technical worker (Nail tech, Builder, Carpenter) communicating at work.
            Return a JSON object with:
            - score (integer 0-100)
            - feedback (string in Vietnamese, encouraging and specific to technical clarity).
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score from 0 to 100" },
            feedback: { type: Type.STRING, description: "Constructive feedback in Vietnamese" }
          },
          required: ["score", "feedback"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as PronunciationResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Pronunciation Check Error:", error);
    return { score: 0, feedback: "Có lỗi xảy ra khi kiểm tra kết nối." };
  }
};

// --- Full Context Roleplay (Conversation) ---

export interface RoleplayTurnResponse {
  ai_response: string;
  user_transcript: string;
  score: number;
  feedback: string;
  is_finished: boolean;
}

export const createRoleplaySession = (context: string) => {
  const ai = createAIClient();
  if (!ai) return null;

  const systemInstruction = `
    You are a character in a Technical Workplace setting (Nail Salon, Construction Site, Workshop). 
    Context: ${context}
    The user is a Technical Professional practicing English with TechSpeak.
    
    Interaction Rules:
    1. Communicate naturally based on the technical context.
    2. Keep responses realistic to workplace interactions.
    3. Evaluate the user's response for every turn based on Technical Accuracy, Clarity, and Politeness.
    4. Provide feedback in Vietnamese.

    Output Format: JSON only.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      ai_response: { type: Type.STRING, description: "Your response to the user in English." },
      user_transcript: { type: Type.STRING, description: "What you heard the user say (in English)." },
      score: { type: Type.INTEGER, description: "Evaluation score 0-100." },
      feedback: { type: Type.STRING, description: "Feedback in Vietnamese about technical clarity or grammar." },
      is_finished: { type: Type.BOOLEAN, description: "True if the interaction is complete." }
    },
    required: ["ai_response", "user_transcript", "score", "feedback", "is_finished"]
  };

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: responseSchema
    },
  });

  return chat;
};

export const sendRoleplayMessage = async (chat: Chat, audioBase64: string | null, textInput: string | null, mimeType: string = 'audio/webm'): Promise<RoleplayTurnResponse> => {
  try {
    const parts: any[] = [];
    const effectiveMimeType = mimeType && mimeType.trim() !== '' ? mimeType : 'audio/webm';

    if (audioBase64) {
      parts.push({ 
        inlineData: { 
          mimeType: effectiveMimeType, 
          data: audioBase64 
        } 
      });
    }
    if (textInput) parts.push({ text: textInput });
    if (parts.length === 0) parts.push({ text: "Please start the workplace scenario." });

    const result = await chat.sendMessage({ message: parts });
    const text = result.text;
    if (text) {
      return JSON.parse(text) as RoleplayTurnResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Roleplay API Error:", error);
    return {
      ai_response: "Sorry, connection error.",
      user_transcript: "",
      score: 0,
      feedback: "Lỗi kết nối TechSpeak AI.",
      is_finished: false
    };
  }
};
