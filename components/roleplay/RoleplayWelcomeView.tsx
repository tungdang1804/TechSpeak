
import React from 'react';
import { Radio, Play } from 'lucide-react';

interface RoleplayWelcomeViewProps {
  userScenario: string;
  onStart: () => void;
  processing: boolean;
}

const RoleplayWelcomeView: React.FC<RoleplayWelcomeViewProps> = ({ userScenario, onStart, processing }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center animate-fade-in">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] flex items-center justify-center mb-6 shadow-sm">
        <Radio size={40} className="animate-pulse" />
      </div>
      <h3 className="text-2xl font-black text-app-text mb-2">Sẵn sàng Thực chiến</h3>
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 mb-10 w-full max-w-sm">
         <p className="text-sm font-bold text-slate-600 italic">"{userScenario}"</p>
      </div>
      <button 
        onClick={onStart} 
        disabled={processing}
        className="w-full max-w-[280px] py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 uppercase text-xs tracking-widest disabled:opacity-50"
      >
        {processing ? 'ĐANG CHUẨN BỊ...' : 'CHÀO KHÁCH HÀNG'}
      </button>
    </div>
  );
};

export default RoleplayWelcomeView;
