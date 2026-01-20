
import React from 'react';
import { Trophy, Mic, Headphones, PenTool, Lock, ChevronRight, Star } from 'lucide-react';
import { Lesson } from '../types';

interface DailyChallengeHubProps {
  onSelectChallenge: (type: 'listening' | 'speaking' | 'writing', scenario?: { context: string, user: string }) => void;
  onClose: () => void;
  lessons: Lesson[];
  unlockedLessonIds: string[];
}

const DailyChallengeHub: React.FC<DailyChallengeHubProps> = ({ onSelectChallenge, onClose, lessons, unlockedLessonIds }) => {
  
  const handleSpeakingCombat = () => {
    // 1. Lọc kịch bản chỉ sử dụng thông tin từ các bài học đã có trong unlockedLessons
    // Mặc định luôn có bài 1 và 2 là bài free
    const freeLessonIds = lessons.slice(0, 2).map(l => l.id);
    const availableLessonIds = Array.from(new Set([...freeLessonIds, ...unlockedLessonIds]));
    
    const availableLessons = lessons.filter(l => availableLessonIds.includes(l.id));
    
    if (availableLessons.length === 0) {
      alert("Hệ thống bài học đang gặp sự cố. Vui lòng thử lại sau!");
      return;
    }

    // 2. Chọn ngẫu nhiên kịch bản từ các bài đã mở
    const randomLesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
    
    onSelectChallenge('speaking', {
      context: randomLesson.roleplay.ai_instructions,
      user: randomLesson.roleplay.user_instructions
    });
  };

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
          onClick={handleSpeakingCombat}
          className="w-full bg-white p-6 rounded-[32px] soft-shadow border border-slate-100 flex items-center gap-5 text-left group active:scale-[0.98] transition-all"
        >
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
            <Mic size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
               <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Kỹ năng Nói</span>
               <div className="flex items-center gap-0.5 bg-indigo-500 px-2 py-0.5 rounded-lg text-[8px] font-black text-white shadow-sm">
                 X2.5 PTS
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
