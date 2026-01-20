
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { GoogleGenAI, Modality } from "@google/genai";
import { getVoicePreference, VOICE_MODELS } from "../utils/audioUtils";

/**
 * Tạo mã hash SHA-256 đơn giản cho text + voiceId
 */
async function generateHash(text: string, voiceId: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text + voiceId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Lấy hoặc tạo tệp âm thanh từ cache
 * Bổ sung try/catch chặt chẽ để xử lý lỗi CORS của Storage
 */
export const getCachedAudio = async (text: string, contextPrompt: string): Promise<string | null> => {
  const gender = getVoicePreference();
  const voiceId = gender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const hash = await generateHash(text + contextPrompt, voiceId);
  const storageRef = ref(storage, `audio_cache/${hash}.wav`);

  try {
    // 1. Kiểm tra trong cache (Có thể lỗi CORS ở đây nếu bucket chưa cấu hình)
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: any) {
    // Nếu lỗi do CORS hoặc không tìm thấy file, bỏ qua và generate mới
    console.warn("Storage cache not available or CORS error, falling back to direct API.");
    return null;
  }
};
