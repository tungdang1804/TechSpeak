
import React, { useState } from 'react';
// Fix: Added ChevronDown to the imported icons from lucide-react
import { Trophy, Mic, Headphones, PenTool, Lock, ChevronRight, Star, Shuffle, BookOpen, Play, ChevronDown } from 'lucide-react';
import { Lesson } from '../types';

interface DailyChallengeHubProps {
  onSelectChallenge: (type: 'listening' | 'speaking' | 'writing', scenario?: { context: string, user: string, multiplier?: number }) => void;
  onClose: () => void;
  lessons: Lesson[];
  unlockedLessonIds: string[];
}

const DailyChallengeHub: React.FC<DailyChallengeHubProps> = ({ onSelectChallenge, onClose, lessons, unlockedLessonIds }) => {
  const [showCombatOptions, setShowCombatOptions] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  const availableLessons = lessons.filter(l => l.order <= 2 || unlockedLessonIds.includes(l.id));

  const handleRandomCombat = () => {
    if (availableLessons.length === 0) return;
    const randomLesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
    onSelectChallenge('speaking', {
      context: randomLesson.roleplay.ai_instructions,
      user: randomLesson.roleplay.user_instructions,
      multiplier: 2.0 // Điểm thưởng ngẫu nhiên x2
    });
  };

  const handleTopicCombat = () => {
    const selectedLesson = availableLessons.find(l => l.id === selectedTopicId);
    if (!selectedLesson) {
      alert("Vui lòng chọn một chủ đề!");
      return;
    }
    onSelectChallenge('speaking', {
      context: selectedLesson.roleplay.ai_instructions,
      user: selectedLesson.roleplay.user_instructions,
      multiplier: 1.5 // Điểm thưởng theo chủ đề x1.5
    });
  };

  if (showCombatOptions) {
    return (
      <div className="h-full flex flex-col bg-app-bg animate-fade-in p-6 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setShowCombatOptions(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <h2 className="text-xl font-black text-app-text">Cấu hình Thực chiến</h2>
        </div>

        <div className="space-y-6">
          {/* Option: Random */}
          <button 
            onClick={handleRandomCombat}
            className="w-full bg-white p-6 rounded-[32px] soft-shadow border-2 border-transparent hover:border-indigo-500 transition-all flex items-center gap-5 text-left group active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Shuffle size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-black text-app-text">Ngẫu nhiên</h4>
                <span className="bg-amber-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Hot</span>
              </div>
              <p className="text-xs text-slate-400 font-bold italic">Thử thách từ các bài đã học.</p>
              <div className="mt-2 text-xs font-black text-indigo-500">THƯỞNG X2.0 PTS</div>
            </div>
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoặc chọn theo chủ đề</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Option: Topic selection */}
          <div className="bg-white p-6 rounded-[32px] soft-shadow border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                 <BookOpen size={24} />
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-black text-app-text">Chọn chủ đề cụ thể</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Thưởng x1.5 PTS</p>
               </div>
            </div>

            <div className="relative mb-6">
              <select 
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-app-text appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="" disabled>--- Chọn chủ đề thực chiến ---</option>
                {availableLessons.map(l => (
                  <option key={l.id} value={l.id}>Bài {l.order}: {l.title}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
              </div>
            </div>

            <button 
              onClick={handleTopicCombat}
              disabled={!selectedTopicId}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 ${selectedTopicId ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-100 text-slate-300 shadow-none'}`}
            >
              <Play size={18} fill="currentColor" /> BẮT ĐẦU THỰC CHIẾN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-y-auto no-scrollbar p-6 pb-24">
      <div className="mb-10 text-center pt-4">
        <div className="w-24 h-24 bg-app-accent/10 text-app-accent rounded-[36px] flex items-center justify-center mx-auto mb-6 soft-shadow border border-app-accent/20">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl font-black text-app-text mb-2">Trung Tâm Thử Thách</h2>
        <p className="text-sm text-slate-400 font-bold px-4 leading-relaxed">Vượt qua các thử thách hàng ngày để tích lũy điểm Star và mở khóa kỹ năng mới!</p>
      </div>

      <div className="space-y-4">
        {/* Listening Challenge */}
        <button 
          onClick={() => onSelectChallenge('listening')}
          className="w-full bg-white p-6 rounded-[32px] soft-shadow border border-slate-100 flex items-center gap-5 text-left group active:scale-[0.98] transition-all"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-sm">
            <Headphones size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Kỹ năng Nghe</span>
               <div className="flex items-center gap-0.5 bg-amber-400 px-2 py-0.5 rounded-lg text-[8px] font-black text-white shadow-sm">
                 <Star size={8} fill="currentColor" /> x100
               </div>
            </div>
            <h4 className="text-base font-black text-app-text truncate">Star Detective</h4>
            <p className="text-[11px] text-slate-400 font-bold italic line-clamp-1">Phân tích hội thoại đặt lịch.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform group-hover:bg-indigo-50 group-hover:text-indigo-400">
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        {/* Speaking Challenge (COMBAT) */}
        <button 
          onClick={() => setShowCombatOptions(true)}
          className="w-full bg-white p-6 rounded-[32px] soft-shadow border border-slate-100 flex items-center gap-5 text-left group active:scale-[0.98] transition-all"
        >
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
            <Mic size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
               <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Kỹ năng Nói</span>
               <div className="flex items-center gap-0.5 bg-indigo-500 px-2 py-0.5 rounded-lg text-[8px] font-black text-white shadow-sm">
                 Bonus Up to x2.0
               </div>
            </div>
            <h4 className="text-base font-black text-app-text truncate">AI Roleplay Combat</h4>
            <p className="text-[11px] text-slate-400 font-bold italic line-clamp-1">Hội thoại thực chiến chuyên ngành.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform group-hover:bg-amber-50 group-hover:text-amber-400">
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        {/* Writing Challenge - Locked */}
        <div className="w-full bg-white/40 p-6 rounded-[32px] border border-dashed border-slate-200 flex items-center gap-5 text-left opacity-60">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
            <PenTool size={32} />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Kỹ năng Viết</span>
            <h4 className="text-base font-black text-slate-400">Client Chat Master</h4>
            <p className="text-[11px] text-slate-400 font-bold italic">Đang xây dựng kịch bản...</p>
          </div>
          <Lock size={18} className="text-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeHub;
