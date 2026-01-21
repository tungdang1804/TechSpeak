
import { GoogleGenAI, Modality } from "@google/genai";

export type VoiceGender = 'female' | 'male';
export type SpeechContext = 'greeting' | 'instruction' | 'normal' | 'fast' | 'phonetic';

export const VOICE_MODELS = {
  female: { name: 'Ms. Minh', voiceId: 'Kore', description: 'Giọng nữ trầm ấm' },
  male: { name: 'Mr. Nam', voiceId: 'Puck', description: 'Giọng nam chuyên nghiệp' }
};

let currentGender: VoiceGender = (localStorage.getItem('voiceGender') as VoiceGender) || 'female';
const audioBufferCache = new Map<string, AudioBuffer>();

// Hàng đợi xử lý yêu cầu để tránh lỗi 429
const requestQueue: (() => Promise<any>)[] = [];
let isProcessingQueue = false;

let activeAudioSource: AudioBufferSourceNode | null = null;
let activeAudioContext: AudioContext | null = null;
let currentPlayingKey: string | null = null;

const getAudioContext = () => {
  if (!activeAudioContext || activeAudioContext.state === 'closed') {
    activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return activeAudioContext;
};

export const stopAllAudio = () => {
  if (activeAudioSource) {
    try {
      activeAudioSource.stop();
      activeAudioSource.disconnect();
    } catch (e) {}
    activeAudioSource = null;
  }
  currentPlayingKey = null;
};

export const setVoicePreference = (gender: VoiceGender) => {
  currentGender = gender;
  localStorage.setItem('voiceGender', gender);
  audioBufferCache.clear();
};

export const getVoicePreference = (): VoiceGender => currentGender;

export const wrapSSML = (text: string, context: SpeechContext = 'normal'): string => {
  const cleanText = text.replace(/[<>]/g, '');
  if (context === 'phonetic') {
    return `Pronounce the isolated phonetic sound for this symbol clearly: /${cleanText}/. Do not say any words, just the sound.`;
  }
  return `Say this clearly at 85% speed with a professional tone: "${cleanText}"`;
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const bufferView = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = bufferView.length / numChannels;
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Chuyển đổi chuẩn xác từ Int16 sang Float32
      const val = bufferView[i * numChannels + channel];
      channelData[i] = val / 32768.0;
    }
  }
  return audioBuffer;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

// Hàm xử lý hàng đợi để tránh spam API
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      await task();
      // Nghỉ 500ms giữa các lần gọi để tránh 429
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  isProcessingQueue = false;
};

export const preloadAudio = async (text: string, context: SpeechContext = 'normal', retryCount = 0) => {
  const voiceName = currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const cacheKey = `${voiceName}_${text}_${context}`;
  
  if (audioBufferCache.has(cacheKey)) return;

  return new Promise((resolve) => {
    requestQueue.push(async () => {
      const ctx = getAudioContext();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = wrapSSML(text, context);

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
          audioBufferCache.set(cacheKey, audioBuffer);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error: any) {
        // Xử lý lỗi 429: Thử lại sau 2 giây
        if ((error?.status === 429 || error?.message?.includes('429')) && retryCount < 3) {
          console.warn(`429 detected for "${text}", retrying in 2s...`);
          await new Promise(r => setTimeout(r, 2000));
          await preloadAudio(text, context, retryCount + 1);
        } else {
          console.error("TTS failed for:", text, error);
        }
        resolve(false);
      }
    });
    processQueue();
  });
};

export const playAudio = async (text: string, context: SpeechContext = 'normal') => {
  const voiceName = currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const cacheKey = `${voiceName}_${text}_${context}`;
  
  stopAllAudio();
  currentPlayingKey = cacheKey;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const playFromBuffer = (buffer: AudioBuffer) => {
    if (currentPlayingKey !== cacheKey) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    activeAudioSource = source;
    source.start(0);
    return new Promise((resolve) => {
      source.onended = () => {
        if (activeAudioSource === source) activeAudioSource = null;
        resolve(true);
      };
    });
  };

  if (audioBufferCache.has(cacheKey)) {
    return playFromBuffer(audioBufferCache.get(cacheKey)!);
  }

  // Load và phát ngay khi xong
  await preloadAudio(text, context);
  if (audioBufferCache.has(cacheKey)) {
    return playFromBuffer(audioBufferCache.get(cacheKey)!);
  }
};
