
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
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
 */
export const getCachedAudio = async (text: string, contextPrompt: string): Promise<string | null> => {
  const gender = getVoicePreference();
  const voiceId = gender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const hash = await generateHash(text + contextPrompt, voiceId);
  const audioRef = ref(storage, `audio_cache/${hash}.wav`);

  try {
    const url = await getDownloadURL(audioRef);
    return url;
  } catch (error: any) {
    console.warn("Storage cache not available or CORS error, falling back to direct API.");
    return null;
  }
};
