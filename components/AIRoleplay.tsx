
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createRoleplaySession, sendRoleplayMessage, RoleplayTurnResponse, analyzeConversationHistory, RoleplaySummary } from '../services/geminiService';
import { blobToBase64, playAudio } from '../utils/audioUtils';
import { Mic, Square, Bot, User, RefreshCw, Sparkles, Volume2, Award, ScrollText, Heart, Loader2, ClipboardCheck, ThumbsUp, Target, TrendingUp } from 'lucide-react';

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
  satisfaction?: number;
}

const AIRoleplay: React.FC<AIRoleplayProps> = ({ scenarioContext, userScenario }) => {
  const [session, setSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentSatisfaction, setCurrentSatisfaction] = useState(70);
  const [summary, setSummary] = useState<RoleplaySummary | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSession = createRoleplaySession(scenarioContext);
    setSession(newSession);
    setMessages([]);
    setInitialized(false);
    setSummary(null);
    setIsFinishing(false);
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
    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
      try {
        const { VoiceRecorder } = await import('https://cdn.jsdelivr.net/npm/@capacitor-community/voice-recorder/+esm' as any);
        await VoiceRecorder.startRecording();
        setIsRecording(true);
        return;
      } catch (e) {}
    }

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
      alert("Vui lòng cấp quyền microphone.");
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
      } catch (e) {}
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const updateMessagesWithResponse = async (tempId: string, response: RoleplayTurnResponse) => {
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== tempId);
      const userMsg: Message = {
        id: tempId,
        sender: 'user',
        text: '',
        transcript: response.user_transcript || "(Audio)",
        score: response.score,
        feedback: response.feedback,
        satisfaction: response.satisfaction
      };
      const aiMsg: Message = { id: aiMsgId, sender: 'ai', text: response.ai_response };
      return [...filtered, userMsg, aiMsg];
    });

    if (response.satisfaction !== undefined) {
      setCurrentSatisfaction(response.satisfaction);
    }

    if (response.is_finished) {
      setIsFinishing(true);
      // Wait a bit for the last AI response to be read or seen
      setTimeout(async () => {
        const history = messages.map(m => ({
          role: m.sender === 'user' ? 'Technician' : 'Customer',
          text: m.sender === 'user' ? m.transcript || '' : m.text
        }));
        // Add current turn to history for analysis
        history.push({ role: 'Technician', text: response.user_transcript });
        history.push({ role: 'Customer', text: response.ai_response });
        
        const report = await analyzeConversationHistory(history);
        setSummary(report);
        setIsFinishing(false);
      }, 1500);
    }

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

  const getSatisfactionEmoji = (val: number) => {
    if (val >= 80) return '😍';
    if (val >= 60) return '😊';
    if (val >= 40) return '😐';
    return '😡';
  };

  if (summary) {
    return (
      <div className="h-full flex flex-col bg-app-bg overflow-y-auto no-scrollbar p-6 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
           <div className="w-20 h-20 bg-green-500 text-white rounded-[32px] flex items-center justify-center mb-4 shadow-xl shadow-green-100">
             <ClipboardCheck size={40} />
           </div>
           <h2 className="text-2xl font-black text-app-text">Tổng Kết Phiên Tập</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Star Spa Performance Report</p>
        </div>

        {/* Professional Rating */}
        <div className="bg-white rounded-5xl p-8 soft-shadow mb-6 border border-white/50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Chỉ số chuyên nghiệp</p>
           <div className="flex items-baseline gap-2">
             <span className="text-6xl font-black text-app-text">{summary.professional_rating}</span>
             <span className="text-xl font-bold text-slate-300">/100</span>
           </div>
           <p className="text-sm font-bold text-slate-500 mt-4 leading-relaxed italic">"{summary.overall_evaluation}"</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
           {/* Strengths */}
           <div className="bg-white rounded-4xl p-6 soft-shadow border border-white/50">
             <h3 className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest mb-4">
               <ThumbsUp size={16} /> Điểm sáng của bạn
             </h3>
             <ul className="space-y-3">
               {summary.strengths.map((s, i) => (
                 <li key={i} className="flex gap-3 text-sm font-bold text-slate-600">
                   <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center shrink-0 text-green-500">✓</div>
                   {s}
                 </li>
               ))}
             </ul>
           </div>

           {/* 3 Improvement Areas */}
           <div className="bg-app-text text-white rounded-4xl p-6 soft-shadow">
             <h3 className="flex items-center gap-2 text-xs font-black text-app-accent uppercase tracking-widest mb-4">
               <TrendingUp size={16} /> 3 Điểm cần lưu ý
             </h3>
             <div className="space-y-4">
               {summary.improvements.slice(0, 3).map((imp, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                   <p className="text-app-accent font-black text-sm mb-1">{imp.word}</p>
                   <p className="text-[11px] text-white/60 font-medium leading-relaxed">{imp.reason}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>

        <button 
          onClick={() => { setSummary(null); setInitialized(false); setMessages([]); }}
          className="w-full py-4 bg-app-primary text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs mb-10"
        >
          Tập luyện lại
        </button>
      </div>
    );
  }

  if (isFinishing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 bg-white">
        <div className="relative mb-8">
           <Loader2 size={60} className="text-app-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles size={24} className="text-app-accent animate-pulse" />
           </div>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center animate-pulse">
          Đang phân tích kỹ thuật của bạn...
        </p>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mb-6 text-indigo-600 shadow-lg">
          <Bot size={48} />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Thực Chiến AI</h2>
        <p className="text-slate-500 mb-6 text-sm">Luyện giao tiếp thực tế và đo lường mức độ hài lòng của khách.</p>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 text-left w-full max-w-sm">
          <h3 className="font-black text-slate-800 mb-2 text-[10px] uppercase tracking-widest flex items-center gap-2">
             <ScrollText size={14} className="text-indigo-500"/> Nhiệm vụ
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{userScenario}</p>
        </div>
        <button onClick={startConversation} className="flex items-center justify-center gap-2 w-full max-w-[240px] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">
          <Sparkles size={18} /> Bắt đầu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Satisfaction Bar */}
      <div className="bg-white border-b border-slate-100 p-3 flex items-center gap-4 z-20">
        <div className="text-lg">{getSatisfactionEmoji(currentSatisfaction)}</div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Khách hàng hài lòng</span>
             <span className="text-[10px] font-black text-indigo-600">{currentSatisfaction}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${currentSatisfaction >= 60 ? 'bg-green-500' : currentSatisfaction >= 40 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${currentSatisfaction}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1
                  ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-50'}`}>
                  {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-4 rounded-[20px] text-sm shadow-sm border bg-white border-indigo-50
                  ${msg.sender === 'user' ? 'rounded-tr-none text-right' : 'rounded-tl-none text-left'}`}>
                  {msg.sender === 'ai' ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-slate-800 font-medium">{msg.text}</p>
                      <button onClick={() => playAudio(msg.text)} className="self-start p-1.5 bg-indigo-50 text-indigo-500 rounded-lg"><Volume2 size={16} /></button>
                    </div>
                  ) : (
                    <p className="text-slate-800 font-bold italic">"{msg.transcript || '...'}"</p>
                  )}
                </div>
              </div>
              {msg.sender === 'user' && msg.score !== undefined && (
                <div className="mt-2 mr-10 p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-left max-w-[200px]">
                   <div className="flex items-center gap-1.5 mb-1 text-amber-500 border-b border-slate-50 pb-1">
                      <Award size={12} />
                      <span className="font-black uppercase text-[8px] tracking-widest">Score: {msg.score}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500">{msg.feedback}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {processing && (
           <div className="flex justify-start ml-12">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                 <Loader2 size={14} className="animate-spin text-indigo-500" />
                 <span className="text-[10px] text-slate-400 font-black">AI IS THINKING...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 pb-10 z-30 shadow-lg">
        <div className="flex items-center justify-center gap-8">
          <button onClick={() => { setInitialized(false); setMessages([]); }} className="w-12 h-12 flex items-center justify-center text-slate-400 bg-slate-50 rounded-full"><RefreshCw size={20} /></button>
          {!isRecording ? (
             <button onClick={startRecording} disabled={processing} className={`w-16 h-16 rounded-[24px] shadow-xl flex items-center justify-center ${processing ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white shadow-indigo-100'}`}><Mic size={28} /></button>
          ) : (
             <button onClick={stopRecording} className="w-16 h-16 bg-red-500 text-white rounded-[24px] shadow-xl flex items-center justify-center animate-pulse"><Square size={24} fill="currentColor" /></button>
          )}
          <div className="w-12 h-12"></div>
        </div>
      </div>
    </div>
  );
};

export default AIRoleplay;
