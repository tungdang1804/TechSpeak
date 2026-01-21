
import { Type, Chat } from "@google/genai";
import { createAIClient } from "../base";

/**
 * Conversation Session Manager
 * Quản lý khởi tạo cấu hình hệ thống (System Instruction)
 */

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
