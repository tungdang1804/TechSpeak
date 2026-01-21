
import { GoogleGenAI, Modality } from "@google/genai";

export type VoiceGender = 'female' | 'male';
export type SpeechContext = 'greeting' | 'instruction' | 'normal' | 'fast' | 'phonetic';

export const VOICE_MODELS = {
  female: { name: 'Ms. Minh', voiceId: 'Kore', description: 'Giọng nữ trầm ấm' },
  male: { name: 'Mr. Nam', voiceId: 'Puck', description: 'Giọng nam chuyên nghiệp' }
};

let currentGender: VoiceGender = (localStorage.getItem('voiceGender') as VoiceGender) || 'female';

// --- CẤU HÌNH INDEXEDDB (PERSISTENT CACHE) ---
const DB_NAME = 'TechSpeakAudioDB';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getCache = async (key: string): Promise<Uint8Array | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch { return null; }
};

const setCache = async (key: string, data: Uint8Array): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, key);
  } catch (e) { console.error("Save to IndexedDB failed", e); }
};

// --- HÀNG ĐỢI REQUEST THROTTLING ---
const requestQueue: (() => Promise<any>)[] = [];
let isProcessingQueue = false;
let globalThrottleUntil = 0;
const MIN_GAP_MS = 500; // Khoảng nghỉ 0.5s giữa các request thành công

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const now = Date.now();
    if (now < globalThrottleUntil) {
      await new Promise(r => setTimeout(r, globalThrottleUntil - now));
    }

    const task = requestQueue.shift();
    if (task) {
      try {
        await task();
        globalThrottleUntil = Date.now() + MIN_GAP_MS;
      } catch (e) {
        console.error("Queue task failed", e);
      }
    }
  }
  isProcessingQueue = false;
};

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
      const val = bufferView[i * numChannels + channel];
      // Hiệu chỉnh giải mã để tránh nhiễu
      channelData[i] = val < 0 ? val / 32768.0 : val / 32767.0;
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

export const preloadAudio = async (text: string, context: SpeechContext = 'normal', retryCount = 0): Promise<boolean> => {
  const voiceName = currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const cacheKey = `${voiceName}_${text}_${context}`;
  
  // Kiểm tra IndexedDB trước
  const cachedData = await getCache(cacheKey);
  if (cachedData) return true;

  return new Promise((resolve) => {
    requestQueue.push(async () => {
      // Kiểm tra lại lần nữa trong queue
      const dataAgain = await getCache(cacheKey);
      if (dataAgain) { resolve(true); return; }

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
          const uint8 = decodeBase64(base64Audio);
          await setCache(cacheKey, uint8);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');
        if (isRateLimit && retryCount < 2) {
          globalThrottleUntil = Date.now() + 5000; // Tạm dừng 5s khi bị rate limit
          setTimeout(() => preloadAudio(text, context, retryCount + 1).then(resolve), 5000);
        } else {
          resolve(false);
        }
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
  if (ctx.state === 'suspended') await ctx.resume();

  const playData = async (data: Uint8Array) => {
    if (currentPlayingKey !== cacheKey) return;
    const buffer = await decodeAudioData(data, ctx);
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

  const cached = await getCache(cacheKey);
  if (cached) return playData(cached);

  const success = await preloadAudio(text, context);
  if (success) {
    const freshData = await getCache(cacheKey);
    if (freshData) return playData(freshData);
  }
};
