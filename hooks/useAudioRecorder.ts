
import { useState, useRef, useCallback } from 'react';
import { blobToBase64 } from '../utils/audioUtils';

// Giả định Capacitor được tích hợp
declare var Capacitor: any;

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/webm');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    setAudioUrl(null);
    setBase64Data(null);

    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
        if (canRecord.value) {
          await VoiceRecorder.startRecording();
          setIsRecording(true);
          return;
        }
      } catch (e) { console.error("Native record fail", e); }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type });
        const b64 = await blobToBase64(blob);
        setMimeType(type);
        setBase64Data(b64);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (e) { alert("Vui lòng cấp quyền Microphone."); }
  }, []);

  const stop = useCallback(async () => {
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform() && isRecording) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        const result = await VoiceRecorder.stopRecording();
        setIsRecording(false);
        setBase64Data(result.value.recordDataBase64);
        setMimeType(result.value.mimeType);
        
        const byteCharacters = atob(result.value.recordDataBase64);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteArray[i] = byteCharacters.charCodeAt(i);
        setAudioUrl(URL.createObjectURL(new Blob([byteArray], { type: result.value.mimeType })));
        return;
      } catch (e) { console.error("Native stop fail", e); }
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, audioUrl, base64Data, mimeType, start, stop };
};
