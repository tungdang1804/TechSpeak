
import { Chat } from "@google/genai";
import { auth } from "../../firebase";
import { getUsageStatus, recordUsage } from "../../usageService";
import { RoleplayTurnResponse } from "../../../types";
import { ADMIN_UID } from "../../userService";

/**
 * Conversation Messaging Service
 * Xử lý luồng tin nhắn và kiểm soát hạn mức
 */

export const sendRoleplayMessage = async (
  chat: Chat, 
  audioBase64: string | null, 
  textInput: string | null, 
  mimeType: string = 'audio/webm'
): Promise<RoleplayTurnResponse> => {
  const uid = auth.currentUser?.uid;
  const usage = await getUsageStatus(uid);
  
  if (usage.isExceeded && uid !== ADMIN_UID) {
    return { 
      ai_response: "Hết lượt dùng hôm nay. Quay lại ngày mai nhé!", 
      user_transcript: "", score: 0, feedback: "", 
      satisfaction: 50, is_finished: true, 
      task_checklist: [], completion_percentage: 0, 
      error: 'LIMIT_EXCEEDED' 
    };
  }

  try {
    const parts: any[] = [];
    if (audioBase64) parts.push({ inlineData: { mimeType, data: audioBase64 } });
    if (textInput) parts.push({ text: textInput });
    
    const result = await chat.sendMessage({ message: parts });
    recordUsage(uid);
    return JSON.parse(result.text || '{}');
  } catch (error: any) {
    return { 
      ai_response: "Mất kết nối với AI.", 
      user_transcript: "", score: 0, feedback: "API Error", 
      satisfaction: 50, is_finished: false, 
      task_checklist: [], completion_percentage: 0 
    };
  }
};
