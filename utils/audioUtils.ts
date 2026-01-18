
export type VoiceGender = 'female' | 'male';

let currentGender: VoiceGender = (localStorage.getItem('voiceGender') as VoiceGender) || 'female';

export const setVoicePreference = (gender: VoiceGender) => {
  currentGender = gender;
  localStorage.setItem('voiceGender', gender);
};

export const getVoicePreference = (): VoiceGender => currentGender;

export const playAudio = (text: string, rate: number = 0.9) => {
  return new Promise<void>((resolve) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous

      const speak = () => {
        // Star Spa is easily pronounced by TTS, no custom replacement needed
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate; // Slightly slower for learners
        
        // Voice Selection Logic
        const voices = window.speechSynthesis.getVoices();
        // Filter for English voices
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        
        let selectedVoice: SpeechSynthesisVoice | undefined;

        if (currentGender === 'male') {
          selectedVoice = enVoices.find(v => 
            v.name.toLowerCase().includes('male') || 
            v.name.includes('David') || 
            v.name.includes('Daniel') ||
            v.name.includes('Google UK English Male')
          );
        } else {
          selectedVoice = enVoices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.includes('Zira') || 
            v.name.includes('Samantha') || 
            v.name.includes('Google US English')
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else if (enVoices.length > 0) {
            utterance.voice = enVoices[0];
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve(); 
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speak;
      } else {
        speak();
      }

    } else {
      console.warn("Text-to-speech not supported");
      resolve();
    }
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
