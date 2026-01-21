
import { GoogleGenAI, Modality } from "@google/genai";
import { audioQueue } from "./queueManager";
import { getCachedAudio, setCachedAudio } from "./storage";

/**
 * Audio API Service
 * Xử lý tương tác với Gemini TTS
 */

export const wrapSSML = (text: string, context: string): string => {
  const cleanText = text.replace(/[<>]/g, '');
  if (context === 'phonetic') {
    return `Pronounce the isolated phonetic sound for this symbol clearly: /${cleanText}/. Do not say any words, just the sound.`;
  }
  return `Say this clearly at 85% speed: "${cleanText}"`;
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const requestPreload = async (
  text: string, 
  voiceId: string, 
  context: string, 
  priority: number = 0
): Promise<boolean> => {
  const cacheKey = `${voiceId}_${text}_${context}`;
  
  const cachedData = await getCachedAudio(cacheKey);
  if (cachedData) return true;

  return new Promise((resolve) => {
    audioQueue.push({
      id: `${cacheKey}_${Date.now()}`,
      priority,
      fn: async () => {
        // Kiểm tra lại cache lần nữa sau khi ra khỏi hàng đợi
        const dataAgain = await getCachedAudio(cacheKey);
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
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceId } },
              },
            },
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const uint8 = decodeBase64(base64Audio);
            await setCachedAudio(cacheKey, uint8);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Gemini TTS Error:", error);
          resolve(false);
        }
      }
    });
  });
};
