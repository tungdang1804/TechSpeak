
import React from 'react';
import { Zap } from 'lucide-react';

interface AIQuotaCardProps {
  used: number;
  limit: number | string;
  isAdmin?: boolean;
}

const AIQuotaCard: React.FC<AIQuotaCardProps> = ({ used, limit, isAdmin }) => {
  const percentage = typeof limit === 'number' ? Math.min(100, (used / limit) * 100) : 100;
  
  return (
    <div className="bg-white p-6 rounded-4xl soft-shadow border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-app-primary" fill="currentColor" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn mức AI hôm nay</span>
        </div>
        <span className="text-xs font-black text-app-text">{used} / {isAdmin ? '∞' : limit}</span>
      </div>
      <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
        <div 
          className={`h-full transition-all duration-1000 ${used >= (typeof limit === 'number' ? limit : Infinity) && !isAdmin ? 'bg-red-500' : 'bg-app-primary'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[9px] text-slate-400 font-bold mt-3 text-center uppercase tracking-widest">Tự động reset sau 24h</p>
    </div>
  );
};

export default AIQuotaCard;
