
import { Type } from "@google/genai";
import { createAIClient } from "../base";
import { auth } from "../../firebase";
import { recordUsage } from "../../usageService";
import { RoleplaySummary } from "../../../types";

/**
 * Conversation Analysis Service
 * Chấm điểm chuyên sâu cuối buổi học
 */

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
