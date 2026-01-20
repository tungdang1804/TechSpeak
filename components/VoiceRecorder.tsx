
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, RefreshCw, Volume2 } from 'lucide-react';
import { playAudio } from '../utils/audioUtils';

interface VoiceRecorderProps {
  targetText: string;
  onCompleted: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ targetText, onCompleted }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAudioUrl(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onCompleted();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Vui lòng cho phép truy cập microphone để luyện tập.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-2">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl text-white">
               <Volume2 size={20} />
             </div>
             <span className="text-sm font-bold text-slate-700">Giọng Bản Xứ</span>
          </div>
          <button 
            onClick={() => playAudio(targetText)}
            className="px-5 py-2 bg-white text-indigo-600 text-xs font-black rounded-xl shadow-sm border border-indigo-100 active:scale-95 transition-all"
          >
            NGHE MẪU
          </button>
        </div>

        <div className="text-xl font-bold text-slate-800 text-center py-4 leading-tight">
          "{targetText}"
        </div>

        <div className="flex justify-center items-center gap-6">
          {!audioUrl ? (
            !isRecording ? (
              <button 
                onClick={startRecording}
                className="flex flex-col items-center justify-center w-20 h-20 bg-indigo-600 rounded-[32px] shadow-xl shadow-indigo-100 text-white hover:bg-indigo-700 transition active:scale-90"
              >
                <Mic size={32} />
                <span className="text-[10px] font-black mt-1 uppercase tracking-widest">GHI ÂM</span>
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="flex flex-col items-center justify-center w-20 h-20 bg-red-500 rounded-[32px] shadow-xl shadow-red-100 text-white animate-pulse active:scale-90"
              >
                <Square size={28} fill="currentColor" />
                <span className="text-[10px] font-black mt-1 uppercase tracking-widest">DỪNG</span>
              </button>
            )
          ) : (
            <div className="flex items-center gap-4 w-full">
              <button 
                onClick={playRecording}
                className="flex-1 flex items-center justify-center gap-3 h-16 bg-green-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                <Play size={24} fill="currentColor" /> NGHE LẠI
              </button>
              <button 
                onClick={() => setAudioUrl(null)}
                className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                aria-label="Thu âm lại"
              >
                <RefreshCw size={24} />
              </button>
            </div>
          )}
        </div>
        
        {audioUrl && (
          <p className="text-center text-[11px] text-green-600 font-black uppercase tracking-widest animate-fade-in">
            Tuyệt vời! Hãy so sánh với giọng mẫu nhé.
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
