
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createRoleplaySession, sendRoleplayMessage, analyzeConversationHistory } from '../services/geminiService';
import { RoleplayTurnResponse, RoleplaySummary, RoleplayChecklistItem } from '../types';
import { getUsageStatus } from '../services/usageService';
import { blobToBase64, playAudio } from '../utils/audioUtils';
import { auth } from '../services/firebase';
import { addPoints, getUserProfile } from '../services/userService';
import { Mic, Square, Bot, User, RefreshCw, Sparkles, Volume2, Award, ScrollText, Loader2, ClipboardCheck, Target, Radio, Star, CheckCircle, Circle, BarChart3, TrendingUp, Send, RotateCcw, CheckSquare, ChevronLeft, Eye, MessageSquareText, TrendingDown, ArrowRight, XCircle } from 'lucide-react';

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
  satisfaction_reason?: string;
}

const AIRoleplay: React.FC<AIRoleplayProps> = ({ scenarioContext, userScenario }) => {
  const [session, setSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [initStep, setInitStep] = useState<0 | 1 | 2 | 3 | 4>(0); 
  const [checklist, setChecklist] = useState<RoleplayChecklistItem[]>([]);
  const [completion, setCompletion] = useState(0);
  const [currentSatisfaction, setCurrentSatisfaction] = useState(60); 
  const [lastSatisfactionReason, setLastSatisfactionReason] = useState<string | null>(null);
  const [summary, setSummary] = useState<RoleplaySummary & { pointsEarned?: number; bonusMultiplier?: number; basePoints?: number } | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [canGrade, setCanGrade] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [usage, setUsage] = useState({ used: 0, remaining: 50, isExceeded: false, limit: 50 });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshUsage = async () => {
    const status = await getUsageStatus();
    setUsage(status);
  };

  const initSession = async () => {
    setInitStep(1);
    const uid = auth.currentUser?.uid || "dang-thanh-tung-admin-account";
    const profile = await getUserProfile(uid);
    const level = (profile.unlockedLessons?.length || 0) + 1;

    const newSession = createRoleplaySession(scenarioContext, level);
    setSession(newSession);
    setMessages([]);
    setSummary(null);
    setChecklist([]);
    setCompletion(0);
    setCanGrade(false);
    setShowReview(false);
    setLastSatisfactionReason(null);
    setCurrentSatisfaction(60);
    
    setTimeout(() => setInitStep(2), 500);
    setTimeout(() => setInitStep(3), 1000);
    setTimeout(() => setInitStep(4), 1500);
    refreshUsage();
  };

  useEffect(() => {
    initSession();
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [scenarioContext]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, processing]);

  const startConversation = async () => {
    if (!session || usage.isExceeded) return;
    setProcessing(true);
    try {
      const response = await sendRoleplayMessage(session, null, "Hello, can we start?");
      refreshUsage();
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: response.ai_response }]);
      setChecklist(response.task_checklist || []);
      playAudio(response.ai_response);
    } catch (e) {} finally { setProcessing(false); }
  };

  const startRecording = async () => {
    if (usage.isExceeded || processing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size > 0) handleUserResponse(audioBlob, mimeType);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { alert("Mic denied."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUserResponse = async (audioBlob: Blob, mimeType: string) => {
    if (!session) return;
    setProcessing(true);
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, sender: 'user', text: '' }]);
    
    try {
      const base64Data = await blobToBase64(audioBlob);
      const response = await sendRoleplayMessage(session, base64Data, null, mimeType);
      
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [...filtered, 
          { id: tempId, sender: 'user', transcript: response.user_transcript, feedback: response.feedback, score: response.score, text: '' },
          { id: (Date.now() + 1).toString(), sender: 'ai', text: response.ai_response, satisfaction: response.satisfaction, satisfaction_reason: response.satisfaction_reason }
        ];
      });

      setChecklist(response.task_checklist || []);
      setCompletion(response.completion_percentage);
      setCurrentSatisfaction(response.satisfaction);
      setLastSatisfactionReason(response.satisfaction_reason || null);
      if (response.completion_percentage >= 100) setCanGrade(true);
      
      playAudio(response.ai_response);
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally { setProcessing(false); }
  };

  const performGrading = async () => {
    setIsFinishing(true);
    const history = messages.map(m => ({ role: m.sender === 'user' ? 'Technician' : 'Customer', text: m.transcript || m.text }));
    try {
      const report = await analyzeConversationHistory(history);
      let multiplier = currentSatisfaction >= 80 ? 1.15 : currentSatisfaction >= 60 ? 1.08 : 1.0;
      const basePoints = Math.floor(report.professional_rating * 0.1 * 2.5);
      const finalPoints = Math.floor(basePoints * multiplier);
      const uid = auth.currentUser?.uid || "dang-thanh-tung-admin-account";
      await addPoints(uid, finalPoints, `Roleplay`);
      setSummary({ ...report, pointsEarned: finalPoints, bonusMultiplier: multiplier, basePoints });
    } catch (e) { alert("Error grading."); } finally { setIsFinishing(false); }
  };

  if (summary && !showReview) return (
    <div className="h-full bg-slate-50 overflow-y-auto no-scrollbar pb-32 pt-4 px-6 animate-fade-in overscroll-contain">
      <div className="bg-white rounded-[40px] p-8 soft-shadow border text-center mb-6 relative overflow-hidden">
        {summary.bonusMultiplier! > 1 && <div className="absolute top-4 right-4 bg-green-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg">BONUS +{Math.round((summary.bonusMultiplier! - 1) * 100)}%</div>}
        <div className="w-16 h-16 bg-amber-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-100"><Star size={32} fill="currentColor" /></div>
        <h2 className="text-5xl font-black text-app-text mb-1">{summary.professional_rating}<span className="text-xl text-slate-300">/100</span></h2>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">PROFESSIONAL RATING</p>
        
        <div className="mt-8 grid grid-cols-2 gap-3">
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Nội dung</p>
              <p className="text-lg font-black text-indigo-600">{summary.scores.content}/40</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Trôi chảy</p>
              <p className="text-lg font-black text-indigo-600">{summary.scores.fluency}/30</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Phát âm</p>
              <p className="text-lg font-black text-indigo-600">{summary.scores.pronunciation}/20</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Ngữ pháp</p>
              <p className="text-lg font-black text-indigo-600">{summary.scores.grammar}/10</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 border mb-8 soft-shadow">
         <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2"><ScrollText size={14} /> Chỉnh sửa chuyên môn</h4>
         <div className="space-y-4">
            {summary.improvements.map((imp, i) => (
              <div key={i} className="bg-red-50 p-5 rounded-[28px] border border-red-100">
                <div className="mb-3">
                   <p className="text-[9px] font-black text-red-400 uppercase mb-1">Lỗi của bạn:</p>
                   <p className="text-sm font-black text-slate-600 italic">"{imp.incorrect}"</p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-white flex items-center justify-between">
                   <div className="flex-1 pr-4">
                      <p className="text-[9px] font-black text-green-600 uppercase mb-1">Nên dùng là:</p>
                      <p className="text-base font-black text-green-700 leading-tight">"{imp.correct}"</p>
                      <p className="text-[10px] text-slate-400 mt-2">💡 {imp.reason}</p>
                   </div>
                   <button onClick={() => playAudio(imp.correct)} className="w-10 h-10 bg-white text-green-500 rounded-xl shadow-md flex items-center justify-center shrink-0 active:scale-90"><Volume2 size={18} /></button>
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button onClick={() => setShowReview(true)} className="w-full py-5 bg-white border text-slate-600 rounded-3xl font-black active:scale-95">XEM LẠI LỊCH SỬ CHAT</button>
        <button onClick={initSession} className="w-full py-5 bg-app-primary text-white rounded-3xl font-black shadow-xl active:scale-95">HOÀN THÀNH & LÀM BÀI KHÁC</button>
      </div>
    </div>
  );

  if (initStep < 4) return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
      <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
      <h3 className="text-xl font-black text-app-text">Đang chuẩn bị phòng tập...</h3>
    </div>
  );

  if (messages.length === 0 && !processing) return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white overflow-y-auto no-scrollbar">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] flex items-center justify-center mb-6 shadow-sm"><Radio size={40} className="animate-pulse" /></div>
      <h3 className="text-2xl font-black text-app-text mb-2 text-center">Sẵn sàng Thực chiến</h3>
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 mb-10 w-full max-w-sm text-center">
         <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{userScenario}"</p>
      </div>
      <button onClick={startConversation} className="w-full max-w-[280px] py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
        <Sparkles size={20} /> CHÀO KHÁCH HÀNG
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="bg-white border-b p-4 grid grid-cols-2 gap-4 z-20 shadow-sm shrink-0">
        <div className="space-y-1">
           <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tiến độ</span><span className="text-[11px] font-black text-indigo-600">{completion}%</span></div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${completion}%` }} /></div>
        </div>
        <div className="space-y-1">
           <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hài lòng</span><span className="text-[11px] font-black text-amber-500">{currentSatisfaction}%</span></div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${currentSatisfaction}%` }} /></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth no-scrollbar pb-44 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        {showReview && (
          <div className="sticky top-0 z-30 bg-amber-100 p-4 rounded-2xl flex items-center justify-between mb-4 animate-fade-in border border-amber-200">
             <span className="text-xs font-black text-amber-700">CHẾ ĐỘ XEM LẠI</span>
             <button onClick={() => setShowReview(false)} className="text-[10px] font-black text-amber-900 bg-white px-3 py-1.5 rounded-xl">QUAY LẠI KẾT QUẢ</button>
          </div>
        )}

        {checklist.length > 0 && (
          <div className="bg-white p-5 rounded-[32px] border border-slate-100 mb-2 soft-shadow animate-fade-in">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} /> Nhiệm vụ cần hoàn thành</h4>
            <div className="space-y-2.5">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.is_completed ? <CheckCircle size={16} className="text-green-500" /> : <div className="w-4 h-4 border-2 border-slate-200 rounded-full" />}
                  <span className={`text-[11px] font-bold ${item.is_completed ? 'text-slate-300 line-through' : 'text-slate-600'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {lastSatisfactionReason && (
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 animate-fade-in">
             <MessageSquareText size={16} className="text-amber-600 shrink-0" />
             <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{lastSatisfactionReason}"</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`p-5 rounded-[28px] text-sm shadow-sm border max-w-[85%] relative ${msg.sender === 'user' ? 'bg-indigo-600 text-white border-indigo-700 rounded-br-none' : 'bg-white text-slate-800 border-slate-100 rounded-bl-none'}`}>
                 {msg.sender === 'ai' && <button onClick={() => playAudio(msg.text)} className="absolute -top-3 -right-3 w-8 h-8 bg-white border shadow-md rounded-full flex items-center justify-center text-app-primary active:scale-90"><Volume2 size={14} /></button>}
                 {msg.text || (msg.transcript && <p className="italic font-bold">"{msg.transcript}"</p>) || <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> <span className="text-[10px] font-black uppercase">Đang phân tích...</span></div>}
                 {msg.feedback && <div className="mt-3 pt-3 border-t border-white/10 text-[10px] font-bold text-white/70">💡 {msg.feedback}</div>}
              </div>
            </div>
          ))}
        </div>
        
        {processing && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
          <div className="flex justify-start animate-fade-in">
             <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-3 shadow-md">
                <Loader2 className="animate-spin text-app-primary" size={18} />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng đang suy nghĩ...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-20" />
      </div>

      {!showReview && (
        <div className="fixed bottom-0 left-0 w-full p-6 pb-12 bg-white/90 backdrop-blur-md border-t z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
               {!isRecording ? (
                 <button onClick={startRecording} disabled={processing || usage.isExceeded} className="flex-1 h-16 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 border-4 border-white transition-all">
                   <Mic size={24} /> {usage.isExceeded ? 'HẾT LƯỢT AI' : 'BẮT ĐẦU NÓI'}
                 </button>
               ) : (
                 <button onClick={stopRecording} className="flex-1 h-16 bg-red-500 text-white rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 animate-pulse active:scale-95 border-4 border-white transition-all">
                   <Square size={20} fill="currentColor" /> DỪNG & GỬI AI
                 </button>
               )}
               <button onClick={initSession} className="w-16 h-16 bg-slate-100 text-slate-400 rounded-[24px] flex items-center justify-center border border-slate-200 active:rotate-180 transition-transform"><RotateCcw size={22} /></button>
            </div>
            {canGrade && <button onClick={performGrading} disabled={processing} className="w-full h-14 bg-amber-500 text-white rounded-[20px] font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 animate-bounce-in border-4 border-white uppercase text-xs">CHỐT BILL & XEM ĐIỂM</button>}
          </div>
        </div>
      )}

      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center animate-fade-in">
           <BarChart3 size={48} className="text-indigo-600 animate-bounce mb-6" />
           <h3 className="text-xl font-black text-app-text mb-2">Đang chấm điểm tổng kết</h3>
           <p className="text-sm text-slate-400 font-bold mb-10">Phân tích hội thoại chuyên sâu...</p>
           <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 animate-pulse w-[65%]" /></div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AIRoleplay;
