
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { GameRound, GameChoice, RoleplayTurnResponse, RoleplaySummary } from "../types";
import { getUsageStatus, recordUsage } from "./usageService";
import { auth } from "./firebase";
import { ADMIN_UID } from "./userService";

const createAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateGameRounds = async (choices: GameChoice[]): Promise<GameRound[]> => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  if (usage.isExceeded) return [];

  const ai = createAIClient();
  const bookingChoices = choices.filter(c => 
    c.category === 'Style' || c.category === 'Payment' || 
    ['Pedicure', 'Manicure', 'Full set'].some(s => c.label.includes(s))
  );

  const choicesContext = bookingChoices.map(c => `{id: "${c.id}", label: "${c.label}"}`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 Nail Salon Booking challenges. Choices: [${choicesContext}].`,
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
    return [];
  }
};

export const assessPronunciation = async (audioBase64: string, targetText: string, mimeType: string = 'audio/webm') => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  if (usage.isExceeded) return { score: 0, feedback: "Hết lượt dùng AI hôm nay.", error: 'LIMIT_EXCEEDED' };

  const ai = createAIClient();
  try {
    const response = await ai.models.generateContent({
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
          properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } },
          required: ["score", "feedback"]
        }
      }
    });
    recordUsage(uid);
    return JSON.parse(response.text || '{"score": 0, "feedback": "Error"}');
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (isRateLimit) return { score: 0, feedback: "Hệ thống Google đang quá tải (429). Thử lại sau 15 giây.", error: 'API_OVERLOAD' };
    return { score: 0, feedback: "Lỗi kết nối AI." };
  }
};

export const createRoleplaySession = (context: string, level: number = 1) => {
  const ai = createAIClient();
  const systemInstruction = `You are a professional customer at a Nail Salon. Context: ${context}.
  Difficulty: Level ${level}. 
  SATISFACTION RULES:
  - Start at 60%. Be strict.
  - If user grammar is bad, decrease 10%.
  - If user is professional, increase 5%.
  satisfaction_reason MUST be in Vietnamese.
  Return JSON only.`;
  
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
        required: ["ai_response", "user_transcript", "score", "feedback", "satisfaction", "satisfaction_reason", "is_finished", "task_checklist", "completion_percentage"]
      }
    },
  });
};

export const sendRoleplayMessage = async (chat: Chat, audioBase64: string | null, textInput: string | null, mimeType: string = 'audio/webm'): Promise<RoleplayTurnResponse> => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  
  // Nếu là Admin thì bỏ qua chặn
  if (usage.isExceeded && uid !== ADMIN_UID) {
    return { ai_response: "Đã hết lượt thử thách hôm nay!", user_transcript: "", score: 0, feedback: "", satisfaction: 50, is_finished: true, task_checklist: [], completion_percentage: 0, error: 'LIMIT_EXCEEDED' };
  }

  try {
    const parts: any[] = [];
    if (audioBase64) parts.push({ inlineData: { mimeType, data: audioBase64 } });
    if (textInput) parts.push({ text: textInput });
    
    const result = await chat.sendMessage({ message: parts });
    recordUsage(uid);
    return JSON.parse(result.text || '{}');
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (isRateLimit) return { ai_response: "API Google (Pro) đang đạt giới hạn tốc độ. Vui lòng đợi 20 giây.", user_transcript: "", score: 0, feedback: "API Rate Limit", satisfaction: 50, is_finished: false, task_checklist: [], completion_percentage: 0, error: 'API_OVERLOAD' };
    return { ai_response: "Lỗi kết nối AI.", user_transcript: "", score: 0, feedback: "", satisfaction: 50, is_finished: false, task_checklist: [], completion_percentage: 0 };
  }
};

export const analyzeConversationHistory = async (history: { role: string; text: string }[]): Promise<RoleplaySummary> => {
  const uid = auth.currentUser?.uid;
  const ai = createAIClient();
  const conversationText = history.map(h => `${h.role}: ${h.text}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this roleplay. 
      CRITICAL SCORING RULES:
      1. Use 100-point scale ONLY.
      2. scores.content: 0-40
      3. scores.fluency: 0-30
      4. scores.pronunciation: 0-20
      5. scores.grammar: 0-10
      Total must be the SUM of above.
      
      IMPROVEMENTS:
      - "incorrect": Exactly what user said wrong.
      - "correct": The proper professional version.
      
      Conversation:
      ${conversationText}`,
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
              properties: {
                content: { type: Type.INTEGER },
                fluency: { type: Type.INTEGER },
                pronunciation: { type: Type.INTEGER },
                grammar: { type: Type.INTEGER }
              },
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
  } catch (error) {
    throw error;
  }
};
