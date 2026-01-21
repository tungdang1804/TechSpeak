
import React, { useMemo } from 'react';
import { UserProfile } from '../../services/userService';
import { getIndustryAssets, RoomItem } from '../../services/classroom/assets';
import { Star, Zap, Crown, Award, Play } from 'lucide-react';

interface StudyRoomProps {
  user: UserProfile;
  onAction?: (action: string) => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ user, onAction }) => {
  const industryAssets = useMemo(() => getIndustryAssets(user.primaryIndustry), [user.primaryIndustry]);
  
  // Sắp xếp theo Layer Z để hiển thị đúng thứ tự xa-gần
  const sortedAssets = useMemo(() => 
    [...industryAssets].sort((a, b) => a.position.z - b.position.z), 
  [industryAssets]);

  const isFemale = user.avatarConfig.gender === 'female';

  return (
    <div className="relative w-full aspect-[4/5] bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl border-4 border-white group">
      {/* 1. BACKGROUND LAYER (Static or dynamic) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[10s] group-hover:scale-110"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800)` }}
      />
      
      {/* 2. DYNAMIC ASSET LAYERS (Furniture, Tools) */}
      {sortedAssets.map((item: RoomItem) => (
        <button
          key={item.id}
          onClick={() => item.action && onAction?.(item.action)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-105 active:scale-95"
          style={{ 
            left: `${item.position.x}%`, 
            top: `${item.position.y}%`, 
            zIndex: item.position.z 
          }}
        >
          {/* Placeholder cho vật phẩm - thực tế sẽ dùng thẻ img */}
          <div className="relative group/item">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-3xl shadow-2xl">
              {item.id.includes('desk') ? '🪑' : item.id.includes('rack') ? '📚' : '🤖'}
            </div>
            {item.action && (
              <div className="absolute -top-2 -right-2 bg-app-accent text-white p-1 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
                <Play size={10} fill="currentColor" />
              </div>
            )}
          </div>
        </button>
      ))}

      {/* 3. CHARACTER LAYER (Avatar) */}
      <div className="absolute inset-0 flex items-end justify-center pb-12 pointer-events-none" style={{ zIndex: 10 }}>
        <div className="relative">
          <div className="text-[120px] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float">
            {isFemale ? '👩‍🔧' : '👨‍🔧'}
          </div>
          <div className="absolute -top-4 -right-4 bg-app-accent text-white p-2 rounded-xl shadow-lg border-2 border-white rotate-12">
            <Crown size={16} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* 4. UI OVERLAYS (HUD) */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-xl">
           <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white">
             <Star size={18} fill="currentColor" />
           </div>
           <div>
             <p className="text-[8px] font-black text-white/60 uppercase leading-none">Star Points</p>
             <p className="text-sm font-black text-white">{user.points.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl flex items-center gap-4">
           <div className="text-right">
             <h4 className="text-sm font-black text-app-text">{user.displayName}</h4>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user.primaryIndustry} Apprentice</p>
           </div>
           <div className="w-10 h-10 bg-app-primary rounded-xl flex items-center justify-center text-white shadow-lg">
             <Award size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
