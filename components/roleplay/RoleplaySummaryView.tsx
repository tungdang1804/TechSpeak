
import React, { useState } from 'react';
import { Star, ScrollText, Volume2, Plus, CheckCircle2 } from 'lucide-react';
import { RoleplaySummary } from '../../types';
import InteractiveText from '../InteractiveText';
import { playAudio } from '../../utils/audioUtils';
import { auth } from '../../services/firebase';
import { saveToLibraryGrammar } from '../../services/userService';

interface RoleplaySummaryViewProps {
  summary: RoleplaySummary & { pointsEarned?: number; bonusMultiplier?: number };
  onRestart: () => void;
  onShowReview: () => void;
  onWordLookup: (word: string) => void;
}

const RoleplaySummaryView: React.FC<RoleplaySummaryViewProps> = ({ summary, onRestart, onShowReview, onWordLookup }) => {
  const [savedPatterns, setSavedPatterns] = useState<string[]>([]);

  const handleSaveToLibrary = async (imp: { incorrect: string, correct: string, reason: string }) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await saveToLibraryGrammar(uid, {
        id: Date.now().toString(),
        original: imp.incorrect,
        corrected: imp.correct,
        explanation: imp.reason,
        timestamp: new Date().toISOString()
      });
      setSavedPatterns(prev => [...prev, imp.correct]);
    } catch (e) {
      alert("Lỗi lưu vào thư viện");
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto no-scrollbar pb-32 pt-4 px-6 animate-fade-in overscroll-contain">
      <div className="bg-white rounded-[40px] p-8 soft-shadow border text-center mb-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-app-primary/10 text-app-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          Bonus: x{summary.bonusMultiplier}
        </div>
        <div className="w-16 h-16 bg-amber-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-100">
          <Star size={32} fill="currentColor" />
        </div>
        <h2 className="text-5xl font-black text-app-text mb-1">{summary.professional_rating}<span className="text-xl text-slate-300">/100</span></h2>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">PROFESSIONAL RATING</p>
        <p className="text-xs font-black text-app-primary mt-4 tracking-widest">+ {summary.pointsEarned} STAR PTS</p>
      </div>

      <div className="bg-white rounded-[32px] p-6 border mb-8 soft-shadow">
         <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
           <ScrollText size={14} /> Chỉnh sửa chuyên môn
         </h4>
         <div className="space-y-4">
            {summary.improvements.map((imp, i) => (
              <div key={i} className="bg-red-50 p-5 rounded-[28px] border border-red-100">
                <div className="mb-3">
                   <p className="text-[9px] font-black text-red-400 uppercase mb-1">Lỗi của bạn:</p>
                   <InteractiveText text={imp.incorrect} onWordClick={onWordLookup} className="text-sm font-black text-slate-600 italic" />
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-white flex items-center justify-between gap-2">
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-green-600 uppercase mb-1">Nên dùng là:</p>
                      <InteractiveText text={imp.correct} onWordClick={onWordLookup} className="text-base font-black text-green-700 leading-tight" />
                      <p className="text-[10px] text-slate-400 mt-2">💡 {imp.reason}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button onClick={() => playAudio(imp.correct)} className="w-9 h-9 bg-white text-green-500 rounded-xl shadow-md flex items-center justify-center active:scale-90">
                        <Volume2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleSaveToLibrary(imp)} 
                        disabled={savedPatterns.includes(imp.correct)}
                        className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center ${savedPatterns.includes(imp.correct) ? 'bg-green-500 text-white' : 'bg-white text-indigo-500'}`}
                      >
                        {savedPatterns.includes(imp.correct) ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                      </button>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button onClick={onShowReview} className="w-full py-5 bg-white border text-slate-600 rounded-3xl font-black active:scale-95 uppercase text-xs tracking-widest">XEM LẠI LỊCH SỬ CHAT</button>
        <button onClick={onRestart} className="w-full py-5 bg-app-primary text-white rounded-3xl font-black shadow-xl active:scale-95 uppercase text-xs tracking-widest">LÀM BÀI KHÁC</button>
      </div>
    </div>
  );
};

export default RoleplaySummaryView;
