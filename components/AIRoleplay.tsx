
import React, { useState, Suspense, lazy } from 'react';
import { useRoleplayLogic } from './roleplay/useRoleplayLogic';
import { Mic, Square, BarChart3 } from 'lucide-react';
import VocabModal from './VocabModal';

const RoleplayWelcomeView = lazy(() => import('./roleplay/RoleplayWelcomeView'));
const RoleplaySummaryView = lazy(() => import('./roleplay/RoleplaySummaryView'));
const RoleplayMessageList = lazy(() => import('./roleplay/RoleplayMessageList'));

interface AIRoleplayProps {
  scenarioContext: string;
  userScenario: string;
  multiplier?: number;
}

const AIRoleplay: React.FC<AIRoleplayProps> = ({ scenarioContext, userScenario, multiplier = 1.0 }) => {
  const {
    messages, isRecording, processing, completion, currentSatisfaction,
    summary, isFinishing, initSession, startConversation, startRecording, 
    setIsRecording, finishAndGrade
  } = useRoleplayLogic(scenarioContext, multiplier);

  const [selectedLookupWord, setSelectedLookupWord] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  if (summary && !showReview) return (
    <Suspense fallback={<div className="h-full flex items-center justify-center font-black">Cám ơn bạn đã tham gia...</div>}>
      <RoleplaySummaryView 
        summary={summary} 
        onRestart={initSession} 
        onShowReview={() => setShowReview(true)}
        onWordLookup={setSelectedLookupWord}
      />
    </Suspense>
  );

  if (messages.length === 0 && !processing) return (
    <Suspense fallback={<div className="h-full flex items-center justify-center font-black">Loading...</div>}>
      <RoleplayWelcomeView userScenario={userScenario} onStart={startConversation} processing={processing} />
    </Suspense>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {selectedLookupWord && <VocabModal word={selectedLookupWord} onClose={() => setSelectedLookupWord(null)} />}

      {/* Header Info */}
      <div className="bg-white border-b p-4 grid grid-cols-2 gap-4 z-20 shadow-sm shrink-0">
        <div className="space-y-1">
           <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <span>Tiến độ</span><span>{completion}%</span>
           </div>
           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${completion}%` }} />
           </div>
        </div>
        <div className="space-y-1">
           <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <span>Hài lòng</span><span>{currentSatisfaction}%</span>
           </div>
           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${currentSatisfaction}%` }} />
           </div>
        </div>
      </div>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center">...</div>}>
        <RoleplayMessageList messages={messages} processing={processing} onWordLookup={setSelectedLookupWord} />
      </Suspense>

      {/* Controls Container */}
      <div className="fixed bottom-0 left-0 w-full p-6 pb-12 bg-white/90 backdrop-blur-md border-t z-30 shadow-lg">
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {!isRecording ? (
            <button onClick={startRecording} disabled={processing} className="w-full h-16 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 uppercase text-xs tracking-[0.2em]">
              <Mic size={24} /> BẮT ĐẦU NÓI
            </button>
          ) : (
            // Removed argument false from setIsRecording as the underlying handleStopRecording function expects zero arguments
            <button onClick={() => setIsRecording()} className="w-full h-16 bg-red-500 text-white rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 animate-pulse active:scale-95 uppercase text-xs tracking-[0.2em]">
              <Square size={20} fill="currentColor" /> DỪNG & GỬI
            </button>
          )}
          {completion >= 100 && (
            <button onClick={finishAndGrade} disabled={processing} className="w-full h-14 bg-amber-500 text-white rounded-[20px] font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 animate-bounce-in uppercase text-xs tracking-widest">
              XEM KẾT QUẢ
            </button>
          )}
        </div>
      </div>

      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center animate-fade-in">
           <BarChart3 size={48} className="text-indigo-600 animate-bounce mb-6" />
           <h3 className="text-xl font-black text-app-text mb-2">Đang chấm điểm...</h3>
        </div>
      )}
    </div>
  );
};

export default AIRoleplay;
