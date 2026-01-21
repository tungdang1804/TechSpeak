
import React, { useState, Suspense, lazy } from 'react';
import { UserProfile } from '../services/userService';
import { 
  User as UserIcon, 
  Star, 
  Settings, 
  LogOut, 
  Trash2, 
  ArrowRight, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { logout, loginWithEmail, upgradeAccount } from '../services/authService';
import { auth } from '../services/firebase';
import { playAudio } from '../utils/audioUtils';

// Lazy loading sub-modules
const AIQuotaCard = lazy(() => import('../components/profile/AIQuotaCard'));
const AuthModule = lazy(() => import('../components/profile/AuthModule'));

interface ProfileProps {
  userProfile: UserProfile;
  voiceGender: string;
  onGenderToggle: () => void;
  quotaInfo: { used: number, limit: number | string };
}

const Profile: React.FC<ProfileProps> = ({ userProfile, voiceGender, onGenderToggle, quotaInfo }) => {
  // Fix: Removed authLoading and authError states as they are handled internally by AuthModule's useAuthForm hook
  const isGuest = !auth.currentUser || auth.currentUser.isAnonymous;

  // Fix: Simplified handleAuthSubmit to remove redundant local state updates. 
  // Any errors thrown here will be caught and displayed by the AuthModule's internal error handler.
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
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <div className={`w-28 h-28 rounded-[40px] flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white ${isGuest ? 'bg-slate-200 text-slate-400' : 'bg-app-primary text-white'}`}>
            {userProfile.displayName?.[0] || 'K'}
          </div>
          {!isGuest && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={20} />
            </div>
          )}
        </div>
        <h3 className="text-2xl font-black text-app-text mb-1">{userProfile.displayName || "Học viên Star"}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < userProfile.starLevel ? "currentColor" : "none"} className={i < userProfile.starLevel ? "text-amber-400" : "text-slate-200"} />
          ))}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isGuest ? "Guest Account" : userProfile.email}</p>
      </div>

      <Suspense fallback={<div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-slate-200" /></div>}>
        <AIQuotaCard used={quotaInfo.used} limit={quotaInfo.limit} isAdmin={userProfile.isAdmin} />
        
        {isGuest && (
          <div className="mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Lưu lại tiến trình học</h4>
            {/* Fix: AuthModule manages its own loading/error state internally; removed invalid props */}
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
