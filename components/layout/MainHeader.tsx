
import React from 'react';
import { Star, User as UserIcon } from 'lucide-react';
import { APP_ASSETS } from '../../constants';

interface MainHeaderProps {
  points: number;
  isGuest: boolean;
  onProfileClick: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ points, isGuest, onProfileClick }) => {
  return (
    <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b shrink-0">
      <div className="flex items-center gap-2">
        <img src={APP_ASSETS.LOGO} className="w-8 h-8 rounded-xl shadow-sm" />
        <span className="font-black text-app-text text-lg italic tracking-tight">TechSpeak</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-amber-400 text-white px-3 py-1.5 rounded-full shadow-md">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-black tracking-tight">{points.toLocaleString()}</span>
        </div>
        <button onClick={onProfileClick} className={`w-9 h-9 rounded-full border-2 overflow-hidden transition-all ${isGuest ? 'bg-slate-100 border-slate-200' : 'bg-app-primary/10 border-app-primary'}`}>
          <div className={`w-full h-full flex items-center justify-center ${isGuest ? 'text-slate-400' : 'text-app-primary'}`}>
            <UserIcon size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default React.memo(MainHeader);
