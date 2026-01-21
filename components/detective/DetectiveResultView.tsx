
import React from 'react';
import { Trophy } from 'lucide-react';

interface DetectiveResultViewProps {
  totalScore: number;
  maxScore: number;
  onBack: () => void;
}

const DetectiveResultView: React.FC<DetectiveResultViewProps> = ({ totalScore, maxScore, onBack }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-app-bg animate-fade-in">
      <div className="w-20 h-20 bg-amber-100 rounded-[32px] flex items-center justify-center mb-6 text-amber-500 shadow-xl border-4 border-white">
        <Trophy size={40} />
      </div>
      <h2 className="text-2xl font-black text-app-text mb-2">Thám Tử Tài Ba!</h2>
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 mb-8 w-full max-w-xs shadow-lg">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tổng điểm thám tử</p>
        <p className="text-5xl font-black text-app-primary">{totalScore}<span className="text-xl text-slate-200">/{maxScore}</span></p>
      </div>
      <button 
        onClick={onBack} 
        className="w-full max-w-xs py-5 bg-app-primary text-white rounded-3xl font-black shadow-xl mb-4 uppercase tracking-widest text-xs active:scale-95 transition-all"
      >
        VỀ MENU CHÍNH
      </button>
    </div>
  );
};

export default DetectiveResultView;
