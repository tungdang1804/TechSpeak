
import { Type } from "@google/genai";
import { createAIClient } from "./base";
import { auth } from "../firebase";
import { getUsageStatus, recordUsage } from "../usageService";

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
    if (isRateLimit) return { score: 0, feedback: "Hệ thống Google đang bận. Thử lại sau 10 giây.", error: 'API_OVERLOAD' };
    return { score: 0, feedback: "Lỗi kết nối AI." };
  }
};
