
import { Type, Chat } from "@google/genai";
import { createAIClient } from "./base";
import { auth } from "../firebase";
import { getUsageStatus, recordUsage } from "../usageService";
import { RoleplayTurnResponse, RoleplaySummary } from "../../types";
import { ADMIN_UID } from "../userService";

export const createRoleplaySession = (context: string, level: number = 1): Chat => {
  const ai = createAIClient();
  const systemInstruction = `You are a professional customer at a Nail Salon. Context: ${context}.
  Difficulty: Level ${level}. 
  SATISFACTION RULES: Start at 60%. Be strict but fair. 
  GOAL TRACKING: Date, Time, Service, People.
  satisfaction_reason MUST be in Vietnamese. Return JSON only.`;
  
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { 
          ai_response: { type: Type.STRING }, 
          user_transcript: { type: Type.STRING }, 
          score: { type: Type.INTEGER }, 
          feedback: { type: Type.STRING }, 
          satisfaction: { type: Type.INTEGER }, 
          satisfaction_reason: { type: Type.STRING },
          is_finished: { type: Type.BOOLEAN },
          completion_percentage: { type: Type.INTEGER },
          task_checklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { task: { type: Type.STRING }, is_completed: { type: Type.BOOLEAN } },
              required: ["task", "is_completed"]
            }
          }
        },
        required: ["ai_response", "user_transcript", "score", "feedback", "satisfaction", "is_finished", "task_checklist", "completion_percentage"]
      }
    },
  });
};

export const sendRoleplayMessage = async (chat: Chat, audioBase64: string | null, textInput: string | null, mimeType: string = 'audio/webm'): Promise<RoleplayTurnResponse> => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  
  if (usage.isExceeded && uid !== ADMIN_UID) {
    return { ai_response: "Hết lượt dùng hôm nay. Quay lại ngày mai nhé!", user_transcript: "", score: 0, feedback: "", satisfaction: 50, is_finished: true, task_checklist: [], completion_percentage: 0, error: 'LIMIT_EXCEEDED' };
  }

  try {
    const parts: any[] = [];
    if (audioBase64) parts.push({ inlineData: { mimeType, data: audioBase64 } });
    if (textInput) parts.push({ text: textInput });
    
    const result = await chat.sendMessage({ message: parts });
    recordUsage(uid);
    return JSON.parse(result.text || '{}');
  } catch (error: any) {
    return { ai_response: "Mất kết nối với AI.", user_transcript: "", score: 0, feedback: "API Error", satisfaction: 50, is_finished: false, task_checklist: [], completion_percentage: 0 };
  }
};

export const analyzeConversationHistory = async (history: { role: string; text: string }[]): Promise<RoleplaySummary> => {
  const uid = auth.currentUser?.uid;
  const ai = createAIClient();
  const conversationText = history.map(h => `${h.role}: ${h.text}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this roleplay conversation strictly. 
      Total score (0-100) = Content(40) + Fluency(30) + Pronunciation(20) + Grammar(10).
      Return IMPROVEMENTS with "incorrect" and "correct" strings.
      Conversation: ${conversationText}`,
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
                properties: { incorrect: { type: Type.STRING }, correct: { type: Type.STRING }, reason: { type: Type.STRING } },
                required: ["incorrect", "correct", "reason"]
              }
            },
            scores: {
              type: Type.OBJECT,
              properties: { content: { type: Type.INTEGER }, fluency: { type: Type.INTEGER }, pronunciation: { type: Type.INTEGER }, grammar: { type: Type.INTEGER } },
              required: ["content", "fluency", "pronunciation", "grammar"]
            }
          },
          required: ["overall_evaluation", "strengths", "improvements", "scores"]
        }
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    const total = data.scores.content + data.scores.fluency + data.scores.pronunciation + data.scores.grammar;
    recordUsage(uid);
    return { ...data, professional_rating: total, total_turns: history.length / 2 };
  } catch (error) { throw error; }
};
