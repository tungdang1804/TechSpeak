
import React from 'react';
import { UserProfile } from '../../services/userService';
import { Star, Zap, Crown, Award } from 'lucide-react';

interface StudyRoomProps {
  user: UserProfile;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ user }) => {
  // Asset giả định - Có thể thay thế bằng link Cloudinary thực tế
  const ASSETS = {
    bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', // Văn phòng ảo
    avatarFemale: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1737452812/avatar_f_base_q8pksg.png', // Placeholder
    avatarMale: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1737452812/avatar_m_base_q8pksg.png', // Placeholder
  };

  const isFemale = user.avatarConfig.gender === 'female';

  return (
    <div className="relative w-full aspect-[4/5] bg-slate-200 rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
      {/* LAYER 1: Background Room */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${ASSETS.bg})`, filter: 'brightness(0.7)' }}
      />
      
      {/* Overlays (Vignette) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* LAYER 2: Character Avatar */}
      <div className="absolute inset-0 flex items-end justify-center pb-12 animate-slide-up">
        <div className="relative">
          {/* Character Image Placeholder (Using Emojis for MVP visual if no assets) */}
          <div className="text-[120px] filter drop-shadow-2xl animate-float">
            {isFemale ? '👩‍🔧' : '👨‍🔧'}
          </div>
          
          {/* Badge indicator */}
          <div className="absolute -top-4 -right-4 bg-app-accent text-white p-2 rounded-xl shadow-lg border-2 border-white rotate-12">
            <Crown size={16} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* LAYER 3: Interactive Furniture (Future usage) */}
      {/* <img src={furnitureSet} className="absolute bottom-0 left-0 w-full" /> */}

      {/* Stats Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-xl">
           <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white">
             <Star size={18} fill="currentColor" />
           </div>
           <div>
             <p className="text-[8px] font-black text-white/60 uppercase leading-none">Star Points</p>
             <p className="text-sm font-black text-white">{user.points.toLocaleString()}</p>
           </div>
        </div>
        <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-xl">
           <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
             <Zap size={18} fill="currentColor" />
           </div>
           <div>
             <p className="text-[8px] font-black text-white/60 uppercase leading-none">Today's Usage</p>
             <p className="text-sm font-black text-white">{user.usageCount}</p>
           </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl flex items-center gap-4">
           <div className="text-right">
             <h4 className="text-sm font-black text-app-text">{user.displayName}</h4>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user.primaryIndustry} Apprentice</p>
           </div>
           <div className="w-10 h-10 bg-app-primary rounded-xl flex items-center justify-center text-white">
             <Award size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
