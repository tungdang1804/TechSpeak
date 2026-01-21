
import { getCachedAudio } from "../services/audio/storage";
import { stopAllPlayback, setCurrentPlayingKey, isKeyPlaying, playBuffer } from "../services/audio/engine";
import { requestPreload } from "../services/audio/api";

/**
 * Audio Public Utilities (Facade)
 * Điểm truy cập duy nhất cho các Component. 
 * Gom các mô-đun nhỏ thành API dễ dùng.
 */

export type VoiceGender = 'female' | 'male';
export type SpeechContext = 'greeting' | 'instruction' | 'normal' | 'fast' | 'phonetic';

export const VOICE_MODELS = {
  female: { name: 'Ms. Minh', voiceId: 'Kore', description: 'Giọng nữ trầm ấm' },
  male: { name: 'Mr. Nam', voiceId: 'Puck', description: 'Giọng nam chuyên nghiệp' }
};

let currentGender: VoiceGender = (localStorage.getItem('voiceGender') as VoiceGender) || 'female';

export const setVoicePreference = (gender: VoiceGender) => {
  currentGender = gender;
  localStorage.setItem('voiceGender', gender);
};

export const getVoicePreference = (): VoiceGender => currentGender;

const getVoiceId = () => currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;

/**
 * Tải trước âm thanh (không phát ngay)
 */
export const preloadAudio = async (text: string, context: SpeechContext = 'normal', priority = 0): Promise<boolean> => {
  return requestPreload(text, getVoiceId(), context, priority);
};

/**
 * Phát âm thanh (có xử lý hàng đợi và cache)
 */
export const playAudio = async (text: string, context: SpeechContext = 'normal') => {
  const voiceId = getVoiceId();
  const cacheKey = `${voiceId}_${text}_${context}`;
  
  stopAllPlayback();
  setCurrentPlayingKey(cacheKey);

  // 1. Kiểm tra Cache
  const cached = await getCachedAudio(cacheKey);
  if (cached) {
    if (isKeyPlaying(cacheKey)) return playBuffer(cached, cacheKey);
    return;
  }

  // 2. Nếu không có cache, gửi yêu cầu với ưu tiên cao (priority = 1)
  const success = await requestPreload(text, voiceId, context, 1);
  if (success && isKeyPlaying(cacheKey)) {
    const freshData = await getCachedAudio(cacheKey);
    if (freshData) return playBuffer(freshData, cacheKey);
  }
};

export const stopAllAudio = stopAllPlayback;

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
