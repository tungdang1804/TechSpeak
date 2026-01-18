
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Award, Loader2, RefreshCw, Volume2, Play } from 'lucide-react';
import { assessPronunciation } from '../services/geminiService';
import { blobToBase64, playAudio } from '../utils/audioUtils';

// Giả định Capacitor được tích hợp
declare var Capacitor: any;

interface NailSpeakScoreProps {
  targetText: string;
  onScoreUpdate: (score: number) => void;
  bestScore: number;
  compact?: boolean;
}

const NailSpeakScore: React.FC<NailSpeakScoreProps> = ({ targetText, onScoreUpdate, bestScore, compact = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Kiểm tra quyền Recording khi khởi tạo
  useEffect(() => {
    const checkPermissions = async () => {
      if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
        try {
          const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
          await VoiceRecorder.requestAudioRecordingPermission();
        } catch (e) {
          console.warn("Native recorder not available, falling back to Web API");
        }
      }
    };
    checkPermissions();
  }, []);

  const startRecording = async () => {
    setResult(null);
    setUserAudioUrl(null);

    // Sử dụng Native Plugin nếu trên Mobile
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
        if (canRecord.value) {
          await VoiceRecorder.startRecording();
          setIsRecording(true);
          return;
        }
      } catch (e) {
        console.error("Native recording failed, trying web fallback", e);
      }
    }

    // Fallback Web API
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const actualMimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
        const url = URL.createObjectURL(audioBlob);
        setUserAudioUrl(url);
        handleAnalysis(audioBlob, actualMimeType);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic Error:", error);
      alert("Vui lòng cho phép truy cập microphone trong cài đặt ứng dụng.");
    }
  };

  const stopRecording = async () => {
    // Native Stop
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform() && isRecording) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        const result = await VoiceRecorder.stopRecording();
        setIsRecording(false);
        
        const base64Data = result.value.recordDataBase64;
        const mimeType = result.value.mimeType;
        
        // Convert base64 to Blob for local playback
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: mimeType });
        setUserAudioUrl(URL.createObjectURL(audioBlob));

        setAnalyzing(true);
        const analysis = await assessPronunciation(base64Data, targetText, mimeType);
        setResult(analysis);
        onScoreUpdate(analysis.score);
        setAnalyzing(false);
        return;
      } catch (e) {
        console.error("Native stop failed", e);
      }
    }

    // Web Stop
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playUserRecording = () => {
    if (userAudioUrl) {
      const audio = new Audio(userAudioUrl);
      audio.play();
    }
  };

  const handleAnalysis = async (audioBlob: Blob, mimeType: string) => {
    setAnalyzing(true);
    const base64 = await blobToBase64(audioBlob);
    const data = await assessPronunciation(base64, targetText, mimeType);
    setResult(data);
    onScoreUpdate(data.score);
    setAnalyzing(false);
  };

  const getCircleColor = (score: number) => {
    if (score >= 75) return 'border-green-400';
    if (score >= 50) return 'border-indigo-400';
    return 'border-red-400';
  };

  return (
    <div className="bg-white flex flex-col items-center w-full max-w-sm mx-auto p-2">
      <div className="flex justify-center mb-6">
        <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-[11px] font-black tracking-widest uppercase shadow-sm">
          TECHSPEAK ASSESSMENT
        </span>
      </div>

      <div className="w-full flex items-center gap-3 mb-8 px-1">
        <div className="flex-1 bg-slate-50/80 rounded-[32px] p-6 border border-slate-100 shadow-sm min-h-[110px] flex items-center justify-center">
          <h3 className="text-xl font-bold text-center text-slate-800 leading-tight">
            "{targetText}"
          </h3>
        </div>
        <button 
          onClick={() => playAudio(targetText)}
          className="w-14 h-14 shrink-0 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600 active:scale-90 transition-all border border-indigo-50"
        >
          <Volume2 size={24} />
        </button>
      </div>

      <div className="relative mb-10">
        {analyzing ? (
          <div className="w-44 h-44 rounded-full border-[12px] border-slate-100 flex flex-col items-center justify-center animate-pulse">
            <Loader2 className="animate-spin text-indigo-500 mb-2" size={40} />
            <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Phân tích...</span>
          </div>
        ) : result ? (
          <div className={`w-44 h-44 rounded-full border-[14px] flex flex-col items-center justify-center bg-white ${getCircleColor(result.score)} transition-all duration-700 shadow-2xl shadow-slate-100`}>
            <span className={`text-6xl font-black ${result.score >= 75 ? 'text-green-500' : 'text-indigo-600'}`}>
              {result.score}
            </span>
            <span className="text-[11px] uppercase font-black tracking-widest text-slate-400">Points</span>
          </div>
        ) : (
          <div className="w-44 h-44 rounded-full border-[10px] border-dashed border-slate-200 flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-2">
               <Mic size={32} className="text-slate-300" />
               <span className="text-slate-400 text-[11px] font-black text-center px-8 uppercase tracking-widest">Luyện đọc</span>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="animate-fade-in w-full bg-indigo-50/40 border border-indigo-100 p-6 rounded-[32px] mb-8 shadow-sm">
          <p className="font-black text-indigo-900 mb-2 text-center text-base">
            {result.score >= 85 ? "Rất xuất sắc! 🥳" : result.score >= 70 ? "Khá tốt! ✨" : "Cố gắng thêm nhé! 💪"}
          </p>
          <p className="text-xs text-indigo-600/80 italic text-center leading-relaxed font-semibold">
            "{result.feedback}"
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 w-full mb-8">
        <button
          onClick={playUserRecording}
          disabled={!userAudioUrl || isRecording}
          className={`w-16 h-16 flex items-center justify-center rounded-full transition-all active:scale-95 border
            ${userAudioUrl && !isRecording 
              ? 'bg-slate-50 text-slate-600 border-slate-200 shadow-md' 
              : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}`}
        >
          <Play size={32} fill={userAudioUrl && !isRecording ? "currentColor" : "none"} />
        </button>

        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={analyzing}
            className="flex-1 max-w-[220px] h-16 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {result ? <RefreshCw size={26} /> : <Mic size={26} />}
            <span>{result ? 'Thử lại' : 'Ghi âm'}</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 max-w-[220px] h-16 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-red-100 animate-pulse active:scale-95"
          >
            <Square size={24} fill="currentColor" />
            <span>Dừng</span>
          </button>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 w-full flex justify-center items-center gap-3">
        <Award size={20} className="text-amber-500" />
        <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest">Kỷ lục:</span>
        <span className="text-base font-black text-slate-800">{bestScore > 0 ? `${bestScore}đ` : '--'}</span>
      </div>
    </div>
  );
};

export default NailSpeakScore;
