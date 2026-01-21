
/**
 * Audio Engine Service
 * Xử lý tầng thấp: AudioContext, Decoding và Playback Control
 */

let activeAudioSource: AudioBufferSourceNode | null = null;
let activeAudioContext: AudioContext | null = null;
let currentPlayingKey: string | null = null;

export const getAudioContext = () => {
  if (!activeAudioContext || activeAudioContext.state === 'closed') {
    activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ 
      sampleRate: 24000 
    });
  }
  return activeAudioContext;
};

export const stopAllPlayback = () => {
  if (activeAudioSource) {
    try {
      activeAudioSource.stop();
      activeAudioSource.disconnect();
    } catch (e) {}
    activeAudioSource = null;
  }
  currentPlayingKey = null;
};

export const setCurrentPlayingKey = (key: string | null) => {
  currentPlayingKey = key;
};

export const isKeyPlaying = (key: string) => currentPlayingKey === key;

/**
 * Giải mã PCM 16-bit (Raw) sang AudioBuffer
 */
export async function decodePCM(
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
      // Chuẩn hóa về dải -1.0 to 1.0
      channelData[i] = val < 0 ? val / 32768.0 : val / 32767.0;
    }
  }
  return audioBuffer;
}

export const playBuffer = async (data: Uint8Array, key: string) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') await ctx.resume();

  const buffer = await decodePCM(data, ctx);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  
  activeAudioSource = source;
  source.start(0);

  return new Promise((resolve) => {
    source.onended = () => {
      if (activeAudioSource === source) {
        activeAudioSource = null;
        if (currentPlayingKey === key) currentPlayingKey = null;
      }
      resolve(true);
    };
  });
};
