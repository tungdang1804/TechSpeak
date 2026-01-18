
import React, { useState, useEffect } from 'react';
import { LESSONS } from './constants';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import NailSpeakHub from './components/NailSpeakHub';
import { UserProgress } from './types';
import { getVoicePreference, setVoicePreference, VoiceGender, playAudio } from './utils/audioUtils';
import { Home, BookOpen, Mic, Settings, User, Trophy } from 'lucide-react';

type TabId = 'home' | 'roadmap' | 'practice' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
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
          progress={progress} 
        />;
      case 'roadmap':
        return (
          <div className="p-6 h-full overflow-y-auto no-scrollbar pb-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-800">
              <BookOpen className="text-indigo-600" /> Lộ trình Nail (Part 1)
            </h2>
            <div className="space-y-4">
              {LESSONS.map((lesson) => (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className="w-full bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg
                    ${progress.completedLessons.includes(lesson.id) ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {lesson.order}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{lesson.title}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{lesson.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center opacity-60">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coming Soon</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Lộ trình Builder & Carpenter đang phát triển</p>
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
          <div className="p-6 h-full flex flex-col items-center pb-32">
            <div className="w-28 h-28 bg-slate-100 rounded-[40px] mb-6 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              <User size={56} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Kỹ thuật viên</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-10">Học viên TechSpeak</p>
            
            <div className="w-full space-y-4">
              <div className="bg-white p-6 rounded-[32px] flex items-center justify-between border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                    <Settings size={22} />
                  </div>
                  <span className="font-bold text-slate-700">Giọng mẫu</span>
                </div>
                <button onClick={handleGenderToggle} className="px-6 py-2.5 bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 active:bg-slate-100 transition-colors border border-slate-100">
                  {voiceGender === 'female' ? '👩 Nữ' : '👨 Nam'}
                </button>
              </div>
              <div className="bg-white p-6 rounded-[32px] flex items-center justify-between border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                    <Trophy size={22} />
                  </div>
                  <span className="font-bold text-slate-700">Tiến độ</span>
                </div>
                <span className="font-black text-indigo-600 text-lg">{progress.completedLessons.length}/{LESSONS.length}</span>
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
    <div className="max-w-md mx-auto app-container bg-slate-50 shadow-2xl relative border-x border-slate-200">
      
      {/* Header (App Bar) - Sticky Native Style */}
      <div className="h-16 px-6 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
        <div className="flex items-center gap-3 active:scale-95 transition-transform">
           <img src="https://res.cloudinary.com/dzwvawf87/image/upload/v1764644344/Fanpage_Logo_HMR_chuden_yrnwkr.png" alt="Logo" className="w-9 h-9 rounded-xl shadow-lg shadow-indigo-100" />
           <span className="font-black text-slate-800 tracking-tight text-xl italic">TechSpeak</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50/80 px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">
           <span className="text-[11px] font-black text-amber-600 uppercase tracking-tight">🔥 5 Days</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto no-scrollbar page-transition">
          {renderActiveTab()}
        </div>
      </div>

      {/* Bottom Tab Bar - iOS/Android Safe Area Ready */}
      <div className="bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-safe pt-2 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] min-h-[85px]">
        <TabButton active={activeTab === 'home'} icon={<Home size={24} />} label="Home" onClick={() => setActiveTab('home')} />
        <TabButton active={activeTab === 'roadmap'} icon={<BookOpen size={24} />} label="Lộ trình" onClick={() => setActiveTab('roadmap')} />
        <TabButton active={activeTab === 'practice'} icon={<Mic size={24} />} label="Luyện nói" onClick={() => setActiveTab('practice')} />
        <TabButton active={activeTab === 'profile'} icon={<User size={24} />} label="Cá nhân" onClick={() => setActiveTab('profile')} />
      </div>

      {/* Fullscreen Overlay - Native Feel Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-[60] bg-white animate-slide-up">
          <LessonPage 
            lesson={activeLesson} 
            allLessons={LESSONS}
            onSelectLesson={(id) => setActiveLessonId(id)}
            onBack={() => setActiveLessonId(null)}
            onComplete={handleLessonComplete}
            savedScores={progress.bestScores}
          />
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
      className={`flex flex-col items-center justify-center gap-1.5 w-20 transition-all active:scale-90 ${active ? 'text-indigo-600' : 'text-slate-300'}`}
    >
      <div className={`p-2.5 rounded-[18px] transition-all duration-300 ${active ? 'bg-indigo-50 shadow-sm' : ''}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: active ? 3 : 2.5 })}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </button>
  );
}

export default App;
