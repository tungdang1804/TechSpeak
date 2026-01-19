
import React, { useState, useEffect } from 'react';
import { LESSONS, APP_ASSETS } from './constants';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import NailSpeakHub from './components/NailSpeakHub';
import StarDetective from './components/StarDetective';
import DailyChallengeHub from './components/DailyChallengeHub';
import { UserProgress } from './types';
import { getVoicePreference, setVoicePreference, VoiceGender, playAudio } from './utils/audioUtils';
import { Home, BookOpen, Mic, Settings, User, Trophy, X, Library } from 'lucide-react';

type TabId = 'home' | 'roadmap' | 'practice' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isChallengeHubOpen, setIsChallengeHubOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<'listening' | 'speaking' | 'writing' | null>(null);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(getVoicePreference());
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('techSpeakProgress');
    return saved ? JSON.parse(saved) : { 
      completedLessons: [], 
      unlockedLessons: ['lesson_1'],
      bestScores: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('techSpeakProgress', JSON.stringify(progress));
  }, [progress]);

  const handleScoreUpdate = (text: string, score: number) => {
    setProgress(prev => {
       const updatedScores = { ...prev.bestScores };
       if (!updatedScores[text] || score > updatedScores[text]) {
         updatedScores[text] = score;
       }
       return { ...prev, bestScores: updatedScores };
    });
  };

  const handleLessonComplete = (id: string, newScores: Record<string, number>) => {
    setProgress(prev => {
      const updatedScores = { ...prev.bestScores };
      Object.entries(newScores).forEach(([key, value]) => {
        if (!updatedScores[key] || value > updatedScores[key]) {
          updatedScores[key] = value;
        }
      });
      const isAlreadyCompleted = prev.completedLessons.includes(id);
      const newCompleted = isAlreadyCompleted ? prev.completedLessons : [...prev.completedLessons, id];
      const currentLessonIndex = LESSONS.findIndex(l => l.id === id);
      const nextLesson = LESSONS[currentLessonIndex + 1];
      const newUnlocked = [...prev.unlockedLessons];
      if (nextLesson && !newUnlocked.includes(nextLesson.id)) {
        newUnlocked.push(nextLesson.id);
      }
      return { completedLessons: newCompleted, unlockedLessons: newUnlocked, bestScores: updatedScores };
    });
  };

  const handleGenderToggle = () => {
    const newGender = voiceGender === 'female' ? 'male' : 'female';
    setVoiceGender(newGender);
    setVoicePreference(newGender);
    playAudio(newGender === 'female' ? "Female voice activated." : "Male voice activated.");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard 
          onSelectLesson={(id) => setActiveLessonId(id)} 
          onSelectPractice={() => setIsChallengeHubOpen(true)}
          onViewRoadmap={() => setActiveTab('roadmap')}
          progress={progress} 
        />;
      case 'roadmap':
        return (
          <div className="p-6 h-full overflow-y-auto no-scrollbar pb-32 animate-fade-in">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-app-text">
              <div className="w-10 h-10 bg-app-primary/10 text-app-primary rounded-xl flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              Lộ trình Star Spa
            </h2>
            <div className="space-y-4">
              {LESSONS.map((lesson) => (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className="w-full bg-white p-5 rounded-[28px] soft-shadow flex items-center gap-4 active:scale-[0.98] transition-all border border-slate-50"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm
                    ${progress.completedLessons.includes(lesson.id) ? 'bg-green-50 text-green-500' : 'bg-app-primary/5 text-app-primary'}`}>
                    {lesson.order}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-black text-app-text text-sm truncate">{lesson.title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">{lesson.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'practice':
        return <NailSpeakHub 
          onBack={() => setActiveTab('home')} 
          progress={progress} 
          onScoreUpdate={handleScoreUpdate} 
        />;
      case 'profile':
        return (
          <div className="p-6 h-full flex flex-col items-center overflow-y-auto no-scrollbar pb-32">
            <div className="w-28 h-28 bg-white rounded-[40px] mb-6 flex items-center justify-center overflow-hidden border-4 border-white soft-shadow shrink-0">
              <User size={56} className="text-slate-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black text-app-text">Kỹ thuật viên</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-10">Star Spa Mastery</p>
            
            <div className="w-full space-y-4">
              <div className="bg-white p-6 rounded-[32px] flex items-center justify-between soft-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-app-primary/10 p-2.5 rounded-xl text-app-primary">
                    <Settings size={22} strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-app-text">Giọng mẫu AI</span>
                </div>
                <button onClick={handleGenderToggle} className="px-6 py-2.5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 active:bg-slate-100 transition-colors border border-slate-100">
                  {voiceGender === 'female' ? '👩 Nữ' : '👨 Nam'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const activeLesson = LESSONS.find(l => l.id === activeLessonId);

  return (
    <div className="max-w-md mx-auto app-container bg-app-bg shadow-2xl relative border-x border-slate-100">
      
      {/* Header (App Bar) */}
      <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50 shrink-0">
        <div className="flex items-center gap-3 active:scale-95 transition-transform">
           <img src={APP_ASSETS.LOGO} alt="Logo" className="w-9 h-9 rounded-xl shadow-lg shadow-app-primary/10" />
           <span className="font-black text-app-text tracking-tight text-xl italic">TechSpeak</span>
        </div>
        <div className="flex items-center gap-2 bg-app-accent/10 px-4 py-1.5 rounded-full border border-app-accent/10">
           <span className="text-[11px] font-black text-app-accent uppercase tracking-tight">🔥 5 Days</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto no-scrollbar page-transition">
          {renderActiveTab()}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-safe pt-2 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] min-h-[85px] shrink-0">
        <TabButton active={activeTab === 'home'} icon={<Home size={24} />} label="Home" onClick={() => setActiveTab('home')} />
        <TabButton active={activeTab === 'roadmap'} icon={<BookOpen size={24} />} label="Lộ trình" onClick={() => setActiveTab('roadmap')} />
        <TabButton active={activeTab === 'practice'} icon={<Library size={24} />} label="Thư viện" onClick={() => setActiveTab('practice')} />
        <TabButton active={activeTab === 'profile'} icon={<User size={24} />} label="Cá nhân" onClick={() => setActiveTab('profile')} />
      </div>

      {/* Lesson Overlay */}
      {activeLesson && (
        <div className="fixed inset-0 z-[60] bg-white animate-slide-up overflow-hidden">
          < LessonPage 
            lesson={activeLesson} 
            allLessons={LESSONS}
            onSelectLesson={(id) => setActiveLessonId(id)}
            onBack={() => setActiveLessonId(null)}
            onComplete={handleLessonComplete}
            savedScores={progress.bestScores}
          />
        </div>
      )}

      {/* Challenge Hub Overlay */}
      {isChallengeHubOpen && !activeChallenge && (
        <div className="fixed inset-0 z-[70] bg-app-bg animate-slide-up overflow-hidden flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
             <div className="flex items-center gap-2">
                <Trophy size={20} className="text-app-accent" />
                <span className="font-black text-app-text">Interactive Hub</span>
             </div>
             <button onClick={() => setIsChallengeHubOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <X size={20} />
             </button>
          </div>
          <DailyChallengeHub 
            onSelectChallenge={(type) => setActiveChallenge(type)} 
            onClose={() => setIsChallengeHubOpen(false)} 
          />
        </div>
      )}

      {/* Star Detective Game Overlay (Listening Challenge) */}
      {activeChallenge === 'listening' && (
        <div className="fixed inset-0 z-[80] bg-app-bg animate-slide-up overflow-hidden flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
             <div className="flex items-center gap-2">
                <Trophy size={20} className="text-app-accent" />
                <span className="font-black text-app-text">Star Detective</span>
             </div>
             <button onClick={() => setActiveChallenge(null)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <X size={20} />
             </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <StarDetective onBack={() => setActiveChallenge(null)} />
          </div>
        </div>
      )}

      <style>{`
        .animate-slide-up {
          animation: slideUpFull 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes slideUpFull {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .pb-safe {
          padding-bottom: max(1.2rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 w-20 transition-all active:scale-90 ${active ? 'text-app-primary' : 'text-slate-300'}`}
    >
      <div className={`p-2.5 rounded-[18px] transition-all duration-300 ${active ? 'bg-app-primary/5' : ''}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: active ? 3 : 2.5 })}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </button>
  );
}

export default App;
