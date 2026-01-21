
import React, { useState, Suspense, lazy } from 'react';
import { UserProfile } from '../services/userService';
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Trash2, 
  ArrowRight, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { logout, loginWithEmail, upgradeAccount } from '../services/authService';
import { auth } from '../services/firebase';
import { playAudio } from '../utils/audioUtils';
import StudyRoom from '../components/profile/StudyRoom';

const AuthModule = lazy(() => import('../components/profile/AuthModule'));

interface ProfileProps {
  userProfile: UserProfile;
  voiceGender: string;
  onGenderToggle: () => void;
  quotaInfo: { used: number, limit: number | string };
}

const Profile: React.FC<ProfileProps> = ({ userProfile, voiceGender, onGenderToggle, quotaInfo }) => {
  const isGuest = !auth.currentUser || auth.currentUser.isAnonymous;

  const handleAuthSubmit = async (data: any) => {
    if (data.mode === 'register') {
      await upgradeAccount(data.email, data.password, data.name);
    } else {
      await loginWithEmail(data.email, data.password);
    }
    playAudio("Welcome back!");
  };

  const handleLogoutClick = async () => {
    if (window.confirm(isGuest ? "Xóa tiến trình khách?" : "Bạn muốn đăng xuất?")) {
      await logout();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in pb-32 overflow-y-auto no-scrollbar">
      {/* 2D Study Room Section */}
      <div className="mb-8">
        <StudyRoom user={userProfile} />
      </div>

      <div className="bg-white rounded-[32px] p-6 soft-shadow border border-slate-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-app-primary/10 rounded-2xl flex items-center justify-center text-app-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-app-text">Kỹ năng Chuyên ngành</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{userProfile.primaryIndustry}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-app-primary">Lvl {userProfile.starLevel}</span>
        </div>
      </div>

      <Suspense fallback={<div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-slate-200" /></div>}>
        {isGuest && (
          <div className="mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Lưu lại tiến trình học</h4>
            <AuthModule onSubmit={handleAuthSubmit} />
          </div>
        )}
      </Suspense>

      <div className="w-full space-y-3">
        <div className="bg-white p-5 rounded-4xl flex items-center justify-between border soft-shadow">
           <div className="flex items-center gap-3"><Settings size={18} className="text-slate-400" /><span className="font-black text-xs uppercase text-slate-600 tracking-widest">Giọng nói AI</span></div>
           <button onClick={onGenderToggle} className="px-5 py-2.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase border border-slate-100 text-app-primary active:scale-95 transition-all">{voiceGender}</button>
        </div>
        
        <button 
          onClick={handleLogoutClick} 
          className="w-full bg-white p-5 rounded-4xl flex items-center justify-between border soft-shadow text-red-500 font-black text-xs uppercase tracking-widest group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            {isGuest ? <Trash2 size={18} /> : <LogOut size={18} />}
            {isGuest ? 'Reset tiến trình' : 'Đăng xuất'}
          </div>
          <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Profile;
