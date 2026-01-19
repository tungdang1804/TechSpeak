
import React from 'react';
import { Trophy, Mic, Headphones, PenTool, Lock, ChevronRight, Star } from 'lucide-react';

interface DailyChallengeHubProps {
  onSelectChallenge: (type: 'listening' | 'speaking' | 'writing') => void;
  onClose: () => void;
}

const DailyChallengeHub: React.FC<DailyChallengeHubProps> = ({ onSelectChallenge, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-app-bg overflow-y-auto no-scrollbar p-6 pb-20">
      <div className="mb-10 text-center pt-4">
        <div className="w-20 h-20 bg-app-accent/10 text-app-accent rounded-[32px] flex items-center justify-center mx-auto mb-6 soft-shadow">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-black text-app-text mb-2">Thử Thách Mỗi Ngày</h2>
        <p className="text-sm text-slate-500 font-medium px-4">Luyện tập phản xạ để nhận điểm Star và thăng hạng kỹ thuật viên!</p>
      </div>

      <div className="space-y-4">
        {/* Listening Challenge - Active */}
        <button 
          onClick={() => onSelectChallenge('listening')}
          className="w-full bg-white p-6 rounded-[32px] soft-shadow border border-slate-100 flex items-center gap-5 text-left group active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Headphones size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Kỹ năng Nghe</span>
               <div className="flex items-center gap-0.5 bg-app-accent/10 px-1.5 py-0.5 rounded text-[8px] font-black text-app-accent">
                 <Star size={8} fill="currentColor" /> x100
               </div>
            </div>
            <h4 className="text-base font-black text-app-text">Star Detective</h4>
            <p className="text-[11px] text-slate-400 font-bold">Lắng nghe yêu cầu khách hàng & chọn mẫu.</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </button>

        {/* Speaking Challenge - Locked */}
        <div className="w-full bg-white/60 p-6 rounded-[32px] border border-slate-100 flex items-center gap-5 text-left opacity-70 grayscale">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
            <Mic size={28} />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Kỹ năng Nói</span>
            <h4 className="text-base font-black text-slate-400">Pronunciation Sprint</h4>
            <p className="text-[11px] text-slate-400 font-bold italic">Đang phát triển...</p>
          </div>
          <Lock size={16} className="text-slate-300" />
        </div>

        {/* Writing Challenge - Locked */}
        <div className="w-full bg-white/60 p-6 rounded-[32px] border border-slate-100 flex items-center gap-5 text-left opacity-70 grayscale">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
            <PenTool size={28} />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Kỹ năng Viết</span>
            <h4 className="text-base font-black text-slate-400">Client Chat Master</h4>
            <p className="text-[11px] text-slate-400 font-bold italic">Đang phát triển...</p>
          </div>
          <Lock size={16} className="text-slate-300" />
        </div>
      </div>

      <div className="mt-12 p-6 bg-app-primary/5 rounded-[32px] border border-app-primary/10">
        <h5 className="text-[10px] font-black text-app-primary uppercase tracking-widest mb-2 flex items-center gap-2">
          <Star size={12} fill="currentColor" /> Tại sao nên tham gia?
        </h5>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Mỗi thử thách thành công sẽ giúp bạn tích lũy kinh nghiệm, mở khóa các huy hiệu chuyên nghiệp và được AI của chúng tôi gợi ý các bài học phù hợp hơn với trình độ hiện tại.
        </p>
      </div>
    </div>
  );
};

export default DailyChallengeHub;
