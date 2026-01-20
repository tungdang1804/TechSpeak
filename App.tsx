
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { APP_ASSETS } from './constants';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import { UserProgress, Lesson } from './types';
import { getVoicePreference, setVoicePreference, VoiceGender, playAudio } from './utils/audioUtils';
import { fetchLessonsFromManifest } from './services/dataService';
import { loginAnonymously, subscribeToAuthChanges, logout } from './services/authService';
import { getUserProfile, subscribeToProfile, updateProgress, UserProfile, addPoints, unlockContent, resetAdminProfile, ADMIN_UID } from './services/userService';
import { Home, BookOpen, Library, User as UserIcon, Loader2, Settings, Star, Zap, CheckCircle2, LogOut, Lock, ShieldCheck, Fingerprint, LogIn, UserPlus, ArrowRight, RefreshCw, X, Trophy } from 'lucide-react';
import { auth } from './services/firebase';

// Lazy loading components
const NailSpeakHub = lazy(() => import('./components/NailSpeakHub'));
const StarDetective = lazy(() => import('./components/StarDetective'));
const DailyChallengeHub = lazy(() => import('./components/DailyChallengeHub'));
const AIRoleplay = lazy(() => import('./components/AIRoleplay'));

// Components phụ được tách ra để "giảm cân" cho App.tsx
const RewardOverlay = ({ data, onClose }: { data: any, onClose: () => void }) => (
  <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
    <div className="bg-white rounded-[48px] w-full max-w-xs p-10 text-center shadow-2xl animate-bounce-in">
      <div className="w-24 h-24 bg-amber-400 text-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200"><Trophy size={48} /></div>
      <h3 className="text-2xl font-black text-app-text mb-2">Chiến thắng!</h3>
      <p className="text-sm text-slate-400 font-bold mb-8">Hệ số thực chiến <span className="text-indigo-600">X2.5</span> giúp bạn nhận <span className="text-amber-500">+{data.points} điểm</span> Star.</p>
      <button onClick={onClose} className="w-full py-5 bg-app-primary text-white rounded-3xl font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">TIẾP TỤC</button>
    </div>
  </div>
);

const UnlockOverlay = ({ target, isUnlocking, onConfirm, onCancel }: { target: any, isUnlocking: boolean, onConfirm: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
    <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center animate-slide-up-modal shadow-2xl">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock size={36} /></div>
      <h3 className="text-xl font-black text-app-text mb-2">Mở khóa nội dung</h3>
      <p className="text-xs text-slate-500 font-medium mb-8 px-4">Dùng <span className="text-amber-500 font-black">{target.cost} điểm</span> để mở khóa <b>{target.title}</b>?</p>
      <div className="space-y-3">
        <button onClick={onConfirm} disabled={isUnlocking} className="w-full py-4 bg-app-primary text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
          {isUnlocking ? <Loader2 className="animate-spin" size={18} /> : 'XÁC NHẬN MỞ KHÓA'}
        </button>
        <button onClick={onCancel} className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black active:scale-95 transition-all">ĐỂ SAU</button>
      </div>
    </div>
  </div>
);

type TabId = 'home' | 'roadmap' | 'practice' | 'profile';

function App() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isChallengeHubOpen, setIsChallengeHubOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<'listening' | 'speaking' | 'writing' | null>(null);
  const [challengeScenario, setChallengeScenario] = useState<{ context: string, user: string } | null>(null);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(getVoicePreference());

  const [rewardData, setRewardData] = useState<{ points: number; totalScore: number; isRoleplay: boolean } | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<{ id: string; type: 'lesson' | 'industry'; cost: number; title: string } | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const data = await fetchLessonsFromManifest();
        setLessons(data);

        await loginAnonymously();

        subscribeToAuthChanges(async (user) => {
          // Logic UID thực tế: Ưu tiên auth.currentUser.uid, fallback là ADMIN_UID cho preview
          const uid = user?.uid || auth.currentUser?.uid || ADMIN_UID;
          
          try {
            const profile = await getUserProfile(uid);
            setUserProfile(profile);
            
            const unsubProfile = subscribeToProfile(uid, (p) => {
              setUserProfile(p);
            });
            
            setIsLoading(false);
            return () => unsubProfile();
          } catch (e) {
            console.error("Profile initialization error", e);
            setIsLoading(false);
          }
        });

      } catch (err) {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleScoreUpdate = async (text: string, score: number) => {
    if (!userProfile) return;
    const uid = userProfile.uid;
    const updatedScores = { ...userProfile.bestScores };
    if (!updatedScores[text] || score > updatedScores[text]) {
      updatedScores[text] = score;
      await updateProgress(uid, { bestScores: updatedScores });
    }
  };

  const handleLessonComplete = async (id: string, newScores: Record<string, number>) => {
    if (!userProfile) return;
    const uid = userProfile.uid;
    
    let totalLessonScore = 0;
    let earnedPoints = 0;
    
    const updatedScores = { ...userProfile.bestScores };
    Object.entries(newScores).forEach(([key, value]) => {
      if (!updatedScores[key] || value > updatedScores[key]) {
        const delta = value - (updatedScores[key] || 0);
        earnedPoints += Math.floor(delta * 0.1);
        updatedScores[key] = value;
      }
      totalLessonScore = Math.max(totalLessonScore, value);
    });

    await updateProgress(uid, {
      completedLessons: userProfile.completedLessons.includes(id) 
        ? userProfile.completedLessons 
        : [...userProfile.completedLessons, id],
      bestScores: updatedScores
    });

    if (earnedPoints > 0) {
      await addPoints(uid, earnedPoints, `Hoàn thành bài học: ${id}`);
      setRewardData({ points: earnedPoints, totalScore: totalLessonScore, isRoleplay: false });
    }
  };

  const handleUnlock = async () => {
    if (!unlockTarget || !userProfile) return;
    const uid = userProfile.uid;
    setIsUnlocking(true);
    const result = await unlockContent(uid, unlockTarget.type, unlockTarget.id, unlockTarget.cost);
    if (result.success) {
      setUnlockTarget(null);
      playAudio("Successfully unlocked!");
    } else {
      alert(result.message);
    }
    setIsUnlocking(false);
  };

  const handleAdminAction = async (mode: 'reset' | 'test') => {
    if (!userProfile?.isAdmin) return;
    const updates = await resetAdminProfile(userProfile.uid, mode);
    setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    alert(mode === 'reset' ? "Tài khoản đã về 0 PTS!" : "Đã nạp full điểm Star!");
  };

  const handleGenderToggle = () => {
    const newGender = voiceGender === 'female' ? 'male' : 'female';
    setVoiceGender(newGender);
    setVoicePreference(newGender);
    playAudio(newGender === 'female' ? "Female voice activated." : "Male voice activated.");
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (lesson.order <= 2 || userProfile?.isAdmin) return true;
    return userProfile?.unlockedLessons?.includes(lesson.id);
  };

  const formatPoints = (p: number) => p > 9999 ? 'FULL' : p.toLocaleString();

  if (isLoading || !userProfile) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-app-bg max-w-md mx-auto">
        <Loader2 size={48} className="text-app-primary animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải TechSpeak Master...</p>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard 
          lessons={lessons}
          onSelectLesson={(id) => {
            const lesson = lessons.find(l => l.id === id);
            if (lesson && !isLessonUnlocked(lesson)) {
              setUnlockTarget({ id, type: 'lesson', cost: 100, title: lesson.title });
            } else {
              setActiveLessonId(id);
            }
          }} 
          onSelectPractice={() => {
            setIsChallengeHubOpen(true);
            setActiveChallenge(null);
          }}
          onViewRoadmap={() => setActiveTab('roadmap')}
          progress={userProfile} 
        />;
      case 'roadmap':
        return (
          <div className="p-6 h-full overflow-y-auto no-scrollbar pb-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-app-text">
              <div className="w-10 h-10 bg-app-primary/10 text-app-primary rounded-xl flex items-center justify-center"><BookOpen size={20} /></div>
              Lộ trình Chuyên nghiệp
            </h2>
            <div className="space-y-4">
              {lessons.map((lesson) => {
                const unlocked = isLessonUnlocked(lesson);
                return (
                  <button key={lesson.id} onClick={() => !unlocked ? setUnlockTarget({ id: lesson.id, type: 'lesson', cost: 100, title: lesson.title }) : setActiveLessonId(lesson.id)}
                    className="w-full bg-white p-5 rounded-[28px] soft-shadow flex items-center gap-4 active:scale-[0.98] transition-all border border-slate-50 relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${userProfile.completedLessons.includes(lesson.id) ? 'bg-green-50 text-green-500' : 'bg-app-primary/5 text-app-primary'}`}>{lesson.order}</div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-black text-app-text text-sm truncate">{lesson.title}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">{lesson.description}</p>
                    </div>
                    {!unlocked && <div className="bg-amber-500 text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-md"><Lock size={10} /> 100 PTS</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'practice':
        return (
          <Suspense fallback={<div className="h-full flex flex-col items-center justify-center"><Loader2 className="animate-spin text-app-primary mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải thư viện...</p></div>}>
            <NailSpeakHub lessons={lessons} onBack={() => setActiveTab('home')} progress={userProfile} onScoreUpdate={handleScoreUpdate} />
          </Suspense>
        );
      case 'profile':
        return (
          <div className="p-6 h-full flex flex-col items-center overflow-y-auto no-scrollbar pb-32">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-white rounded-[44px] flex items-center justify-center overflow-hidden border-4 border-white soft-shadow-lg shrink-0">
                {userProfile.photoURL ? <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" /> : userProfile.isAdmin ? <div className="bg-gradient-to-br from-amber-300 to-amber-500 w-full h-full flex items-center justify-center text-white text-4xl font-black">T</div> : <div className="bg-slate-100 w-full h-full flex items-center justify-center text-slate-300"><UserIcon size={64} strokeWidth={1.5} /></div>}
              </div>
              {userProfile.isAdmin && <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-2xl border-4 border-app-bg shadow-lg"><ShieldCheck size={20} fill="currentColor" /></div>}
            </div>
            <h3 className="text-2xl font-black text-app-text mb-1">{userProfile.displayName || "Tech Artist"}</h3>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">{userProfile.isAdmin ? "QUẢN TRỊ VIÊN" : "HỌC VIÊN CHUYÊN CẦN"}</p>

            <div className="w-full bg-white rounded-[40px] p-6 mb-8 soft-shadow border border-white/50 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center border-r border-slate-100">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">USER UID</span>
                <span className="text-sm font-black text-app-text flex items-center gap-1.5"><Fingerprint size={14} className="text-slate-400" /> {userProfile.uid.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">ĐIỂM STAR</span>
                <span className="text-sm font-black text-amber-500 flex items-center gap-1.5"><Star size={14} fill="currentColor" /> {formatPoints(userProfile.points)}</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="bg-white p-6 rounded-[32px] flex items-center justify-between soft-shadow border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="bg-app-primary/10 p-3 rounded-2xl text-app-primary"><Settings size={20} strokeWidth={2.5} /></div>
                  <span className="font-black text-app-text text-sm">Phong cách Giọng AI</span>
                </div>
                <button onClick={handleGenderToggle} className="px-5 py-2.5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 flex items-center gap-2 active:scale-95 transition-all">
                  {voiceGender === 'female' ? '👩 NỮ' : '👨 NAM'}
                </button>
              </div>

              {userProfile.isAdmin && (
                <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 shadow-sm w-full">
                   <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><ShieldCheck size={14} /> Admin Debug Console</h4>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleAdminAction('reset')} className="flex items-center justify-center gap-2 py-3.5 bg-white text-red-500 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-sm border border-red-100 active:scale-95 transition-all"><RefreshCw size={14} /> Reset 0 PTS</button>
                      <button onClick={() => handleAdminAction('test')} className="flex items-center justify-center gap-2 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-amber-200 active:scale-95 transition-all"><Zap size={14} fill="currentColor" /> Full Points</button>
                   </div>
                </div>
              )}

              <button onClick={() => { logout(); window.location.reload(); }} className="w-full bg-white p-6 rounded-[32px] flex items-center justify-between soft-shadow border border-white/50 text-red-500 transition-all active:scale-95"><div className="flex items-center gap-4"><div className="bg-red-50 p-3 rounded-2xl"><LogOut size={20} strokeWidth={2.5} /></div><span className="font-black text-sm">Đăng xuất hệ thống</span></div><ArrowRight size={18} className="opacity-30" /></button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto app-container bg-app-bg shadow-2xl relative border-x border-slate-100 h-full overflow-hidden flex flex-col">
      <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50 shrink-0">
        <div className="flex items-center gap-2">
           <img src={APP_ASSETS.LOGO} alt="TechSpeak" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
           <span className="font-black text-app-text tracking-tight text-xl italic">TechSpeak</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-400 text-white px-3 py-1.5 rounded-full shadow-lg shadow-amber-200">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-black">{formatPoints(userProfile.points)}</span>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm active:scale-90 transition-transform"
          >
            {userProfile.photoURL ? <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center ${userProfile.isAdmin ? 'bg-amber-400 text-white' : 'bg-app-primary/10 text-app-primary'}`}>{userProfile.isAdmin ? 'ADM' : <UserIcon size={16} />}</div>}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto no-scrollbar">{renderActiveTab()}</div>
      </div>

      <div className="bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-safe pt-2 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] min-h-[85px] shrink-0">
        <TabButton active={activeTab === 'home'} icon={<Home size={24} />} label="Home" onClick={() => setActiveTab('home')} />
        <TabButton active={activeTab === 'roadmap'} icon={<BookOpen size={24} />} label="Lộ trình" onClick={() => setActiveTab('roadmap')} />
        <TabButton active={activeTab === 'practice'} icon={<Library size={24} />} label="Thư viện" onClick={() => setActiveTab('practice')} />
        <TabButton active={activeTab === 'profile'} icon={<UserIcon size={24} />} label="Cá nhân" onClick={() => setActiveTab('profile')} />
      </div>

      {isChallengeHubOpen && (
        <div className="fixed inset-0 z-[70] bg-app-bg animate-slide-up overflow-hidden flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between bg-white border-b shrink-0 shadow-sm">
             <div className="flex items-center gap-2"><Trophy size={20} className="text-app-accent" /><span className="font-black text-app-text">Trung tâm Thử thách</span></div>
             <button onClick={() => { setIsChallengeHubOpen(false); setActiveChallenge(null); }} className="p-2 text-slate-400 active:scale-90 transition-transform"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-hidden relative bg-app-bg">
            <Suspense fallback={<div className="h-full flex flex-col items-center justify-center"><Loader2 className="animate-spin text-app-primary mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải mô-đun...</p></div>}>
              {!activeChallenge ? (
                <DailyChallengeHub lessons={lessons} unlockedLessonIds={userProfile.unlockedLessons.length === 0 ? lessons.slice(0, 2).map(l => l.id) : userProfile.unlockedLessons} onSelectChallenge={(type, scenario) => { setActiveChallenge(type); if(scenario) setChallengeScenario(scenario); }} onClose={() => setIsChallengeHubOpen(false)} />
              ) : activeChallenge === 'listening' ? (
                <StarDetective onBack={() => setActiveChallenge(null)} />
              ) : (
                challengeScenario && <AIRoleplay scenarioContext={challengeScenario.context} userScenario={challengeScenario.user} />
              )}
            </Suspense>
          </div>
        </div>
      )}

      {activeLessonId && lessons.find(l => l.id === activeLessonId) && (
        <div className="fixed inset-0 z-[60] bg-white animate-slide-up overflow-hidden">
          <LessonPage lesson={lessons.find(l => l.id === activeLessonId)!} allLessons={lessons} onSelectLesson={setActiveLessonId} onBack={() => setActiveLessonId(null)} onComplete={handleLessonComplete} savedScores={userProfile.bestScores} />
        </div>
      )}

      {rewardData && <RewardOverlay data={rewardData} onClose={() => setRewardData(null)} />}

      {unlockTarget && (
        <UnlockOverlay 
          target={unlockTarget} 
          isUnlocking={isUnlocking} 
          onConfirm={handleUnlock} 
          onCancel={() => setUnlockTarget(null)} 
        />
      )}

      <style>{`
        .animate-slide-up { animation: slideUpFull 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .animate-slide-up-modal { animation: slideUpModal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes slideUpFull { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pb-safe { padding-bottom: max(1.2rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 w-20 transition-all active:scale-90 ${active ? 'text-app-primary' : 'text-slate-300'}`}>
      <div className={`p-2.5 rounded-[18px] transition-all duration-300 ${active ? 'bg-app-primary/5' : ''}`}>{React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: active ? 3 : 2.5 })}</div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </button>
  );
}

export default App;
