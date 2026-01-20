
import { GoogleGenAI, Modality } from "@google/genai";

export type VoiceGender = 'female' | 'male';
export type SpeechContext = 'greeting' | 'instruction' | 'normal' | 'fast';

export const VOICE_MODELS = {
  female: { name: 'Ms. Minh', voiceId: 'Kore', description: 'Giọng nữ trầm ấm, chuyên nghiệp' },
  male: { name: 'Mr. Nam', voiceId: 'Puck', description: 'Giọng nam dõng dạc, rõ ràng' }
};

let currentGender: VoiceGender = (localStorage.getItem('voiceGender') as VoiceGender) || 'female';
const audioBufferCache = new Map<string, AudioBuffer>();

let activeAudioSource: AudioBufferSourceNode | null = null;
let activeAudioContext: AudioContext | null = null;
let currentPlayingKey: string | null = null;

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

/**
 * Cố định phong cách đọc theo yêu cầu:
 * <speak><prosody rate="85%" pitch="-1st">[Văn bản]</prosody></speak>
 */
export const generateProsodyPrompt = (text: string, context: SpeechContext): string => {
  if (context === 'fast') return text;
  // Gửi chỉ dẫn SSML giả lập thông qua Prompt cho Gemini 2.5 TTS
  return `Please speak the following text at a rate of 85% and pitch -1st, like a professional technician: "${text}"`;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to convert blob"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const preloadAudio = async (text: string, context: SpeechContext = 'normal') => {
  const voiceName = currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const cacheKey = `${voiceName}_${text}_${context}`;
  
  if (audioBufferCache.has(cacheKey)) return;

  if (!activeAudioContext || activeAudioContext.state === 'closed') {
    activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = generateProsodyPrompt(text, context);

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
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), activeAudioContext);
      audioBufferCache.set(cacheKey, audioBuffer);
    }
  } catch (error) {
    console.warn("Preload failed:", text);
  }
};

export const playAudio = async (text: string, context: SpeechContext = 'normal') => {
  const voiceName = currentGender === 'female' ? VOICE_MODELS.female.voiceId : VOICE_MODELS.male.voiceId;
  const cacheKey = `${voiceName}_${text}_${context}`;
  
  stopAllAudio();
  currentPlayingKey = cacheKey;

  if (!activeAudioContext || activeAudioContext.state === 'closed') {
    activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  const ctx = activeAudioContext;

  const playFromBuffer = (buffer: AudioBuffer) => {
    if (currentPlayingKey !== cacheKey) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    activeAudioSource = source;
    source.start();
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

  await preloadAudio(text, context);
  if (audioBufferCache.has(cacheKey)) {
    return playFromBuffer(audioBufferCache.get(cacheKey)!);
  }
};
