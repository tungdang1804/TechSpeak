
import React, { useState, useEffect } from 'react';
import { Mic, Square, Award, Loader2, RefreshCw, Volume2, Play } from 'lucide-react';
import { assessPronunciation } from '../services/geminiService';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { playAudio } from '../utils/audioUtils';

interface NailSpeakScoreProps {
  targetText: string;
  onScoreUpdate: (score: number) => void;
  bestScore: number;
}

const NailSpeakScore: React.FC<NailSpeakScoreProps> = ({ targetText, onScoreUpdate, bestScore }) => {
  const { isRecording, audioUrl, base64Data, mimeType, start, stop } = useAudioRecorder();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  useEffect(() => {
    if (base64Data && !isRecording) {
      handleAnalysis(base64Data, mimeType);
    }
  }, [base64Data, isRecording]);

  const handleAnalysis = async (b64: string, type: string) => {
    setAnalyzing(true);
    try {
      const data = await assessPronunciation(b64, targetText, type);
      setResult(data);
      onScoreUpdate(data.score);
    } finally {
      setAnalyzing(false);
    }
  };

  const playUserRecording = () => {
    if (audioUrl) new Audio(audioUrl).play();
  };

  return (
    <div className="bg-white flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="w-full flex items-center gap-3 mb-6 px-1">
        <div className="flex-1 bg-app-bg rounded-[32px] p-6 border border-slate-100 flex items-center justify-center">
          <h3 className="text-xl font-bold text-center text-app-text leading-tight">"{targetText}"</h3>
        </div>
        <button onClick={() => playAudio(targetText)} className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-app-primary border border-app-primary/10"><Volume2 size={24} /></button>
      </div>

      <div className="relative mb-8">
        {analyzing ? (
          <div className="w-40 h-40 rounded-full border-[10px] border-slate-100 flex flex-col items-center justify-center animate-pulse">
            <Loader2 className="animate-spin text-app-primary mb-2" size={32} />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phân tích...</span>
          </div>
        ) : result ? (
          <div className={`w-40 h-40 rounded-full border-[12px] flex flex-col items-center justify-center bg-white ${result.score >= 85 ? 'border-green-400' : 'border-app-primary'} transition-all shadow-2xl`}>
            <span className={`text-6xl font-black ${result.score >= 85 ? 'text-green-500' : 'text-app-primary'}`}>{result.score}</span>
            <span className="text-[10px] uppercase font-black text-slate-400">Points</span>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full border-[10px] border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300">
            <Mic size={28} />
          </div>
        )}
      </div>

      {result && (
        <div className="animate-fade-in w-full bg-app-primary/5 border border-app-primary/10 p-5 rounded-[28px] mb-6">
          <p className="font-black text-app-primary mb-1 text-center">{result.score >= 85 ? "Rất xuất sắc! 🥳" : "Khá tốt! ✨"}</p>
          <p className="text-xs text-app-text/70 italic text-center leading-relaxed">"{result.feedback}"</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 w-full mb-6">
        <button onClick={playUserRecording} disabled={!audioUrl || isRecording} className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 border active:scale-95 disabled:opacity-30">
          <Play size={28} fill={audioUrl && !isRecording ? "currentColor" : "none"} />
        </button>
        {!isRecording ? (
          <button onClick={start} disabled={analyzing} className="flex-1 max-w-[200px] h-14 flex items-center justify-center gap-3 bg-app-primary text-white rounded-[24px] font-black shadow-2xl active:scale-95">
            {result ? <RefreshCw size={22} /> : <Mic size={22} />} {result ? 'Thử lại' : 'Ghi âm'}
          </button>
        ) : (
          <button onClick={stop} className="flex-1 max-w-[200px] h-14 flex items-center justify-center gap-3 bg-red-500 text-white rounded-[24px] font-black shadow-2xl animate-pulse">
            <Square size={20} fill="currentColor" /> Dừng
          </button>
        )}
      </div>

      <div className="pt-5 border-t w-full flex justify-center items-center gap-3">
        <Award size={18} className="text-app-accent" />
        <span className="text-[11px] text-slate-400 font-black uppercase">Kỷ lục: {bestScore > 0 ? `${bestScore}đ` : '--'}</span>
      </div>
    </div>
  );
};

export default NailSpeakScore;
