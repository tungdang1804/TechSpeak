
import React, { useEffect, Suspense, lazy, useMemo } from 'react';
import { Lesson } from './types';
import { getVoicePreference, setVoicePreference, VoiceGender, playAudio } from './utils/audioUtils';
import { fetchLessonsFromManifest } from './services/dataService';
import { useUserProgress } from './hooks/useUserProgress';
import { useAppNavigation } from './hooks/useAppNavigation';
import { Home, BookOpen, Library as LibraryIcon, User as UserIcon, X, Trophy } from 'lucide-react';
import { auth } from './services/firebase';
import MainHeader from './components/layout/MainHeader';

// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const Library = lazy(() => import('./pages/Library'));
const Profile = lazy(() => import('./pages/Profile'));
const StarDetective = lazy(() => import('./components/StarDetective'));
const DailyChallengeHub = lazy(() => import('./components/DailyChallengeHub'));
const AIRoleplay = lazy(() => import('./components/AIRoleplay'));
const UnlockModal = lazy(() => import('./components/overlays/UnlockModal'));

const LoadingOverlay = () => (
  <div className="h-full w-full flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md z-[200]">
    <div className="w-16 h-16 border-4 border-slate-100 border-t-app-primary rounded-full animate-spin"></div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-6">TechSpeak Master</span>
  </div>
);

function App() {
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const { userProfile, isLoading, tryUnlock } = useUserProgress();
  const nav = useAppNavigation();
  const [voiceGender, setVoiceGender] = React.useState<VoiceGender>(getVoicePreference());

  useEffect(() => {
    fetchLessonsFromManifest().then(setLessons);
  }, []);

  const handleGenderToggle = () => {
    const newGender = voiceGender === 'female' ? 'male' : 'female';
    setVoiceGender(newGender);
    setVoicePreference(newGender);
    playAudio(newGender === 'female' ? "Giọng nữ." : "Giọng nam.");
  };

  const isGuest = useMemo(() => !auth.currentUser || auth.currentUser.isAnonymous, [auth.currentUser]);
  const isLessonUnlocked = (lesson: Lesson) => (lesson.order <= 2 || userProfile?.isAdmin || userProfile?.unlockedLessons.includes(lesson.id));

  const quotaInfo = useMemo(() => {
    if (!userProfile) return { used: 0, limit: 50 };
    const limit = isGuest ? 50 : (100 + (userProfile.starLevel * 20));
    return { used: userProfile.usageCount || 0, limit: userProfile.isAdmin ? '∞' : limit };
  }, [userProfile, isGuest]);

  if (isLoading || !userProfile) return <LoadingOverlay />;

  return (
    <div className="app-container shadow-2xl border-x border-slate-100 flex flex-col font-sans">
      <MainHeader points={userProfile.points} isGuest={isGuest} onProfileClick={() => nav.navigateToTab('profile')} />

      <div className="flex-1 relative overflow-hidden bg-app-bg">
        <div className="absolute inset-0 overflow-y-auto no-scrollbar scroll-smooth">
          <Suspense fallback={<LoadingOverlay />}>
            {nav.activeTab === 'home' && (
              <Dashboard 
                lessons={lessons} progress={userProfile} 
                onSelectLesson={(id) => { 
                  const l = lessons.find(l => l.id === id); 
                  if (l && !isLessonUnlocked(l)) nav.setUnlockTarget({ id, type: 'lesson', cost: 100, title: l.title }); 
                  else nav.openLesson(id); 
                }} 
                onSelectPractice={nav.openChallengeHub} onViewRoadmap={() => nav.navigateToTab('roadmap')} 
              />
            )}
            {nav.activeTab === 'roadmap' && (
              <div className="p-6 h-full pb-32 animate-fade-in">
                <div className="mb-8 px-2"><h2 className="text-2xl font-black text-app-text mb-1">Lộ trình Đào tạo</h2><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Star Artist Journey</p></div>
                <div className="space-y-4">
                  {lessons.map(l => {
                    const unlocked = isLessonUnlocked(l);
                    return (
                      <button key={l.id} onClick={() => unlocked ? nav.openLesson(l.id) : nav.setUnlockTarget({ id: l.id, type: 'lesson', cost: 100, title: l.title })} className="w-full bg-white p-5 rounded-4xl soft-shadow flex items-center gap-4 border border-slate-50 active:scale-[0.98]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${unlocked ? 'bg-app-primary/10 text-app-primary' : 'bg-slate-100 text-slate-400'}`}>{l.order}</div>
                        <div className="text-left flex-1 min-w-0"><h4 className={`font-black text-sm truncate ${unlocked ? 'text-app-text' : 'text-slate-400'}`}>{l.title}</h4><p className="text-[10px] text-slate-400 font-bold truncate uppercase">{l.description}</p></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {nav.activeTab === 'practice' && <Library lessons={lessons} profile={userProfile} />}
            {nav.activeTab === 'profile' && <Profile userProfile={userProfile} voiceGender={voiceGender} onGenderToggle={handleGenderToggle} quotaInfo={quotaInfo} />}
          </Suspense>
        </div>
      </div>

      <div className="bg-white border-t flex items-center justify-around px-4 pb-safe pt-2 h-[85px] shrink-0">
        <TabButton active={nav.activeTab === 'home'} icon={<Home />} label="Home" onClick={() => nav.navigateToTab('home')} />
        <TabButton active={nav.activeTab === 'roadmap'} icon={<BookOpen />} label="Roadmap" onClick={() => nav.navigateToTab('roadmap')} />
        <TabButton active={nav.activeTab === 'practice'} icon={<LibraryIcon />} label="Library" onClick={() => nav.navigateToTab('practice')} />
        <TabButton active={nav.activeTab === 'profile'} icon={<UserIcon />} label="Profile" onClick={() => nav.navigateToTab('profile')} />
      </div>

      <Suspense fallback={<LoadingOverlay />}>
        {nav.isChallengeHubOpen && (
          <div className="fixed inset-0 z-[70] bg-app-bg animate-slide-up flex flex-col">
            <div className="h-16 px-6 flex items-center justify-between bg-white border-b shrink-0">
               <div className="flex items-center gap-2 text-app-accent font-black uppercase text-xs tracking-widest"><Trophy size={18} /> Challenge Hub</div>
               <button onClick={nav.closeChallengeHub} className="p-2 text-slate-300"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-hidden">
                {!nav.activeChallenge ? <DailyChallengeHub lessons={lessons} unlockedLessonIds={userProfile.unlockedLessons} onSelectChallenge={nav.startChallenge} onClose={nav.closeChallengeHub} />
                : nav.activeChallenge === 'listening' ? <StarDetective onBack={() => nav.setActiveChallenge(null)} />
                : nav.challengeScenario && <AIRoleplay scenarioContext={nav.challengeScenario.context} userScenario={nav.challengeScenario.user} multiplier={nav.challengeScenario.multiplier} />}
            </div>
          </div>
        )}
        {nav.activeLessonId && (
          <div className="fixed inset-0 z-[60] bg-white animate-slide-up overflow-hidden">
            <LessonPage lesson={lessons.find(l => l.id === nav.activeLessonId)!} allLessons={lessons} onSelectLesson={nav.openLesson} onBack={nav.closeLesson} savedScores={userProfile.bestScores} />
          </div>
        )}
        {nav.unlockTarget && <UnlockModal target={nav.unlockTarget} onConfirm={async () => { const r = await tryUnlock(nav.unlockTarget.id, nav.unlockTarget.type, nav.unlockTarget.cost); if(r.success) nav.setUnlockTarget(null); else alert(r.message); }} onCancel={() => nav.setUnlockTarget(null)} />}
      </Suspense>
    </div>
  );
}

const TabButton = React.memo(({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 w-20 active:scale-90 transition-all ${active ? 'text-app-primary' : 'text-slate-300'}`}>
    <div className={`p-2 rounded-2xl ${active ? 'bg-app-primary/10' : ''}`}>{React.cloneElement(icon, { size: 22 })}</div>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
));

export default App;
