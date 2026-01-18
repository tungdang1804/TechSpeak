
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createRoleplaySession, sendRoleplayMessage, RoleplayTurnResponse } from '../services/geminiService';
import { blobToBase64, playAudio } from '../utils/audioUtils';
import { Mic, Square, Bot, User, RefreshCw, Send, Loader2, Sparkles, Volume2, Award, ScrollText } from 'lucide-react';

declare var Capacitor: any;

interface AIRoleplayProps {
  scenarioContext: string;
  userScenario: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  score?: number;
  feedback?: string;
  transcript?: string;
}

const AIRoleplay: React.FC<AIRoleplayProps> = ({ scenarioContext, userScenario }) => {
  const [session, setSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSession = createRoleplaySession(scenarioContext);
    setSession(newSession);
    setMessages([]);
    setInitialized(false);
  }, [scenarioContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing]);

  const startConversation = async () => {
    if (!session) return;
    setProcessing(true);
    setInitialized(true);
    const response = await sendRoleplayMessage(session, null, "Hello, please start the roleplay as the customer.");
    const aiMsg: Message = { id: Date.now().toString(), sender: 'ai', text: response.ai_response };
    setMessages([aiMsg]);
    setProcessing(false);
    playAudio(response.ai_response);
  };

  const startRecording = async () => {
    // Native Recording
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        await VoiceRecorder.startRecording();
        setIsRecording(true);
        return;
      } catch (e) {
        console.error("Native start failed", e);
      }
    }

    // Web Fallback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const capturedMimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: capturedMimeType });
        handleUserResponse(audioBlob, capturedMimeType);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic Error:", error);
      alert("Please allow microphone access in your system settings.");
    }
  };

  const stopRecording = async () => {
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform() && isRecording) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        const result = await VoiceRecorder.stopRecording();
        setIsRecording(false);
        setProcessing(true);
        
        const tempId = Date.now().toString();
        setMessages(prev => [...prev, { id: tempId, sender: 'user', text: '...' }]);
        
        const response = await sendRoleplayMessage(session!, result.value.recordDataBase64, null, result.value.mimeType);
        updateMessagesWithResponse(tempId, response);
        return;
      } catch (e) {
        console.error("Native stop failed", e);
      }
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const updateMessagesWithResponse = (tempId: string, response: RoleplayTurnResponse) => {
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== tempId);
      const userMsg: Message = {
        id: tempId,
        sender: 'user',
        text: '',
        transcript: response.user_transcript || "(Audio)",
        score: response.score,
        feedback: response.feedback
      };
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response.ai_response };
      return [...filtered, userMsg, aiMsg];
    });
    setProcessing(false);
    playAudio(response.ai_response);
  };

  const handleUserResponse = async (audioBlob: Blob, mimeType: string) => {
    if (!session) return;
    setProcessing(true);
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, sender: 'user', text: '...' }]);
    const base64Audio = await blobToBase64(audioBlob);
    const response = await sendRoleplayMessage(session, base64Audio, null, mimeType);
    updateMessagesWithResponse(tempId, response);
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  if (!initialized) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-white">
        <div className="w-28 h-28 bg-indigo-50 rounded-[40px] flex items-center justify-center mb-8 text-indigo-600 shadow-xl shadow-indigo-50/50">
          <Bot size={56} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">Thực Chiến AI</h2>
        <p className="text-slate-500 mb-8 font-medium">
          Luyện nói tự nhiên với khách hàng ảo. Nhận phản hồi ngay lập tức về phát âm và độ lưu loát.
        </p>

        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-10 text-left w-full max-w-sm shadow-sm">
          <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
             <ScrollText size={18} className="text-indigo-500"/> Nhiệm vụ của bạn:
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
            {userScenario}
          </p>
        </div>

        <button
          onClick={startConversation}
          disabled={!session}
          className="flex items-center justify-center gap-3 w-full max-w-[280px] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles size={22} />
          Bắt đầu ngay
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-1
                  ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-50'}`}>
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-[24px] text-sm shadow-sm border
                  ${msg.sender === 'user' 
                    ? 'bg-white border-indigo-50 rounded-tr-none text-right' 
                    : 'bg-white border-indigo-50 rounded-tl-none text-left'}`}>
                  {msg.sender === 'ai' ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-slate-800 leading-relaxed text-base font-medium">{msg.text}</p>
                      <button onClick={() => playAudio(msg.text)} className="self-start p-2 bg-indigo-50 text-indigo-500 rounded-xl active:scale-90 transition-all">
                        <Volume2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-800 font-bold text-base leading-snug italic">"{msg.transcript || '...'}"</p>
                  )}
                </div>
              </div>
              {msg.sender === 'user' && msg.score !== undefined && (
                <div className="mt-3 mr-12 animate-fade-in-up">
                   <div className={`inline-flex flex-col p-4 rounded-[24px] border ${getScoreColor(msg.score)} max-w-xs text-left shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2 border-b border-black/5 pb-2">
                         <Award size={16} />
                         <span className="font-black uppercase text-[10px] tracking-widest">Feedback: {msg.score}/100</span>
                      </div>
                      <p className="text-[11px] font-bold leading-relaxed opacity-90">{msg.feedback}</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {processing && (
           <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-4 rounded-[24px] rounded-tl-none shadow-sm ml-12">
                 <Loader2 size={20} className="animate-spin text-indigo-500" />
                 <span className="text-sm text-slate-400 font-bold tracking-tight">AI đang lắng nghe...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 pb-10 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => { setInitialized(false); setMessages([]); }}
            className="w-14 h-14 flex items-center justify-center text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100 transition-all active:scale-90"
          >
            <RefreshCw size={24} />
          </button>

          {!isRecording ? (
             <button
               onClick={startRecording}
               disabled={processing}
               className={`flex items-center justify-center w-20 h-20 rounded-[32px] shadow-2xl transition-all active:scale-95
                 ${processing 
                    ? 'bg-slate-100 text-slate-300' 
                    : 'bg-indigo-600 text-white shadow-indigo-100'}`}
             >
               <Mic size={36} />
             </button>
          ) : (
             <button
               onClick={stopRecording}
               className="flex items-center justify-center w-20 h-20 bg-red-500 text-white rounded-[32px] shadow-2xl shadow-red-100 animate-pulse active:scale-95"
             >
               <Square size={32} fill="currentColor" />
             </button>
          )}

          <div className="w-14 h-14"></div>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.2em]">
           {isRecording ? "ĐANG GHI ÂM" : processing ? "ĐANG XỬ LÝ" : "NHẤN ĐỂ TRẢ LỜI"}
        </p>
      </div>
    </div>
  );
};

export default AIRoleplay;
