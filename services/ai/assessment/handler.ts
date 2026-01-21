
import { auth } from "../../firebase";
import { getUsageStatus, recordUsage } from "../../usageService";
import { callPronunciationAPI } from "./engine";

/**
 * AI Assessment Handler
 * Quản lý logic nghiệp vụ bao quanh việc đánh giá
 */

export const assessPronunciation = async (audioBase64: string, targetText: string, mimeType: string = 'audio/webm') => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  
  if (usage.isExceeded) {
    return { score: 0, feedback: "Hết lượt dùng AI hôm nay.", error: 'LIMIT_EXCEEDED' };
  }

  try {
    const response = await callPronunciationAPI(audioBase64, targetText, mimeType);
    recordUsage(uid);
    return JSON.parse(response.text || '{"score": 0, "feedback": "Error"}');
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (isRateLimit) {
      return { 
        score: 0, 
        feedback: "Hệ thống Google đang bận (429). Thử lại sau 10 giây.", 
        error: 'API_OVERLOAD' 
      };
    }
    return { score: 0, feedback: "Lỗi kết nối AI." };
  }
};
