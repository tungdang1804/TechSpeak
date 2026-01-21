
import React, { useState, Suspense, lazy } from 'react';
import { UserProfile } from '../services/userService';
import { Lesson } from '../types';
import { 
  Library as LibraryIcon, 
  Book, 
  Mic2, 
  Star,
  Layers,
  Loader2
} from 'lucide-react';

// Lazy load modules
const VocabularyModule = lazy(() => import('../components/library/VocabularyModule'));
const GrammarModule = lazy(() => import('../components/library/GrammarModule'));
const IPAModule = lazy(() => import('../components/library/IPAModule'));

interface LibraryProps {
  lessons: Lesson[];
  profile: UserProfile;
}

type LibraryTab = 'vocab' | 'grammar' | 'ipa';

const ModuleLoading = () => (
  <div className="h-40 flex items-center justify-center text-slate-300 gap-3">
    <Loader2 className="animate-spin" size={20} />
    <span className="text-[10px] font-black uppercase tracking-widest">Đang tải dữ liệu...</span>
  </div>
);

const Library: React.FC<LibraryProps> = ({ lessons, profile }) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('vocab');

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      {/* Tab Header */}
      <div className="bg-white pt-4 pb-2 px-4 shrink-0 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-app-primary font-black text-lg tracking-tight">
            <LibraryIcon size={22} strokeWidth={3} />
            <span>Thư viện Star Artist</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-400 text-white px-3 py-1.5 rounded-full shadow-md">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-black">{profile.points.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'vocab' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
          >
            <Book size={14} /> Từ vựng
          </button>
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'grammar' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
          >
            <Layers size={14} /> Ngữ pháp
          </button>
          <button 
            onClick={() => setActiveTab('ipa')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ipa' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
          >
            <Mic2 size={14} /> Bảng IPA
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <Suspense fallback={<ModuleLoading />}>
          {activeTab === 'vocab' && <VocabularyModule lessons={lessons} />}
          {activeTab === 'grammar' && <GrammarModule lessons={lessons} profile={profile} />}
          {activeTab === 'ipa' && <IPAModule />}
        </Suspense>
      </div>
    </div>
  );
};

export default Library;
