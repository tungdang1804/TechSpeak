
import React, { useState, useMemo } from 'react';
import { IPA_SOUNDS } from '../constants';
import { SPECIALIZED_VOCAB } from '../data/specialVocab';
import { UserProgress, IPASound, Lesson } from '../types';
import { ArrowLeft, Volume2, ChevronDown, CheckCircle, Library } from 'lucide-react';
import NailSpeakScore from './NailSpeakScore';
import { playAudio } from '../utils/audioUtils';

interface NailSpeakHubProps {
  lessons: Lesson[];
  onBack: () => void;
  progress: UserProgress;
  onScoreUpdate: (text: string, score: number) => void;
}

type Tab = 'ipa' | 'vocab' | 'grammar';

interface PracticeItem {
  id: string;
  text: string;
  sub: string;
  tag?: string;
  ipa?: string;
}

interface PracticeGroup {
  lessonTitle: string;
  icon?: string;
  isSpecialized?: boolean;
  items: PracticeItem[];
}

const HighlightIPA: React.FC<{ text: string; target: string }> = ({ text, target }) => {
  if (!text.includes(target)) return <span className="font-mono text-slate-500">{text}</span>;
  
  const parts = text.split(target);
  return (
    <span className="font-mono text-slate-500">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-app-primary font-bold bg-app-primary/10 px-0.5 rounded">{target}</span>}
        </React.Fragment>
      ))}
    </span>
  );
};

const NailSpeakHub: React.FC<NailSpeakHubProps> = ({ lessons, onBack, progress, onScoreUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ipa');
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [selectedIPA, setSelectedIPA] = useState<IPASound>(IPA_SOUNDS[0]);
  
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>("special_0");

  const vocabByLesson = useMemo<PracticeGroup[]>(() => {
    const specializedGroups: PracticeGroup[] = SPECIALIZED_VOCAB.map((group, idx) => ({
      lessonTitle: group.title,
      icon: group.icon,
      isSpecialized: true,
      items: group.subGroups.flatMap(sg => sg.items.map(item => ({
        ...item,
        tag: sg.name
      })))
    }));

    const lessonVocab: PracticeGroup[] = lessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.vocabularies.map(v => ({ 
        id: v.id, 
        text: v.word, 
        sub: v.translation,
        ipa: v.ipa 
      }))
    })).filter(group => group.items.length > 0);

    return [...specializedGroups, ...lessonVocab];
  }, [lessons]);

  const grammarByLesson = useMemo<PracticeGroup[]>(() => {
    return lessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.grammarPoints.flatMap(gp => 
        gp.examples.map((ex, idx) => ({ 
          id: `${gp.id}_${idx}`, 
          text: ex.english, 
          sub: ex.vietnamese,
          tag: gp.title
        }))
      )
    })).filter(group => group.items.length > 0);
  }, [lessons]);

  React.useEffect(() => {
    setSelectedItem(null);
    setExpandedGroupKey("special_0"); 
  }, [activeTab]);

  const toggleGroup = (key: string) => {
    setExpandedGroupKey(prev => (prev === key ? null : key));
  };

  const renderIPADetails = () => {
    if (!selectedIPA) return null;
    return (
      <div className="bg-white rounded-3xl soft-shadow p-6 mb-6 animate-fade-in sticky top-0 z-10 border border-white/50">
        <div className="flex items-start justify-between mb-4 border-b border-slate-50 pb-4">
          <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-bold font-serif text-app-primary">{selectedIPA.symbol}</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {selectedIPA.name || selectedIPA.type}
              </span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            <span className="font-bold mr-1 text-app-text">👄 Cách đọc:</span>
            {selectedIPA.description}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4">
           <p className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-widest">Ví dụ ngành Nail:</p>
           <div className="grid grid-cols-1 gap-2">
              {selectedIPA.examples.map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:border-app-primary/30" onClick={() => playAudio(ex.word)}>
                   <div className="flex flex-col">
                      <span className="font-bold text-app-text text-lg">{ex.word}</span>
                      <span className="text-xs text-slate-400 italic font-medium">{ex.meaning}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <HighlightIPA text={ex.ipa} target={selectedIPA.symbol} />
                      <div className="bg-app-primary/10 p-2 rounded-full text-app-primary">
                        <Volume2 size={18} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const renderIPA = () => (
    <div className="p-4 pb-20">
      {renderIPADetails()}
      <h4 className="font-black text-app-text text-[11px] mb-4 flex items-center gap-2 uppercase tracking-widest">
        <span className="w-1 h-3.5 bg-app-primary rounded-full"></span> Nguyên âm đơn
      </h4>
      <div className="grid grid-cols-4 gap-2 mb-8">
        {IPA_SOUNDS.filter(s => s.type === 'vowel').map((s) => (
          <button 
            key={s.symbol}
            onClick={() => {
                setSelectedIPA(s);
                document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                selectedIPA.symbol === s.symbol 
                ? 'bg-app-primary text-white border-app-primary soft-shadow scale-105' 
                : 'bg-white text-app-text border-slate-100'
            }`}
          >
            <span className="text-xl font-bold font-serif">{s.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPracticeList = (groups: PracticeGroup[]) => (
    <div className="flex flex-col h-full bg-app-bg">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <div className="space-y-3">
          {groups.map((group, groupIdx) => {
            const key = group.isSpecialized ? `special_${groupIdx}` : `lesson_${groupIdx}`;
            const isOpen = expandedGroupKey === key;
            return (
              <div key={key} className={`bg-white rounded-3xl soft-shadow border overflow-hidden transition-all duration-300 ${group.isSpecialized ? 'border-app-accent/30' : 'border-white/50'}`}>
                <button 
                  onClick={() => toggleGroup(key)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? (group.isSpecialized ? 'bg-app-accent/5' : 'bg-app-primary/5') : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    {group.icon ? (
                      <div className="w-10 h-10 bg-app-accent/10 rounded-xl flex items-center justify-center text-xl">{group.icon}</div>
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isOpen ? 'bg-app-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {group.isSpecialized ? '★' : groupIdx - (groups.filter(g => g.isSpecialized).length) + 1}
                      </div>
                    )}
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-0.5 ${group.isSpecialized ? 'text-app-accent' : 'text-app-primary'}`}>
                        {group.isSpecialized ? "KHO CHUYÊN NGÀNH" : `BÀI ${groupIdx - (groups.filter(g => g.isSpecialized).length) + 1}`}
                      </span>
                      <h3 className="font-black text-app-text text-sm leading-tight">{group.lessonTitle}</h3>
                    </div>
                  </div>
                  <div className={`${group.isSpecialized ? 'text-app-accent' : 'text-app-primary'} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2 animate-fade-in">
                    {group.items.map(item => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected 
                              ? 'bg-white border-app-primary ring-2 ring-app-primary/5 shadow-md z-10' 
                              : 'bg-white border-slate-100 text-slate-600 hover:border-app-primary/30 shadow-sm'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 text-app-primary">
                              <CheckCircle size={14} />
                            </div>
                          )}
                          <p className={`font-black text-xs mb-1 line-clamp-2 ${isSelected ? 'text-app-primary' : 'text-app-text'}`}>
                            {item.text}
                          </p>
                          <p className="text-[10px] text-slate-300 truncate font-bold uppercase tracking-tight">{item.sub}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedItem && (
          <div className="mt-6 w-full animate-fade-in-up pb-10">
             <div className="bg-white p-6 rounded-5xl soft-shadow text-center relative overflow-hidden border border-white/50">
                <div className="absolute top-0 left-0 w-full h-1.5 header-gradient opacity-50"></div>
                {selectedItem.tag && (
                  <span className="inline-block mb-3 bg-app-primary/5 text-app-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {selectedItem.tag}
                  </span>
                )}
                {selectedItem.ipa && (
                   <div className="mb-4">
                      <span className="font-mono text-slate-400 bg-slate-50 px-4 py-1.5 rounded-xl text-xl tracking-wide border border-slate-100">
                          {selectedItem.ipa}
                      </span>
                   </div>
                )}
                <p className="text-lg text-app-text font-black mb-6">"{selectedItem.sub}"</p>
                <button 
                  onClick={() => playAudio(selectedItem.text)}
                  className="w-full flex items-center justify-center gap-3 bg-app-primary/5 text-app-primary py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest mb-6 active:scale-95 transition"
                >
                  <Volume2 size={20} />
                  <span>Nghe mẫu phát âm</span>
                </button>
                <NailSpeakScore 
                  targetText={selectedItem.text}
                  bestScore={progress.bestScores[selectedItem.text] || 0}
                  onScoreUpdate={(s) => onScoreUpdate(selectedItem.text, s)}
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      <div className="bg-white shadow-sm pt-4 pb-2 px-4 z-20 shrink-0 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2 text-app-primary font-black text-lg tracking-tight">
            <Library size={20} className="text-app-primary" />
            Thư viện Star Spa
          </div>
          <div className="w-10"></div>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-2xl">
          <button onClick={() => setActiveTab('ipa')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${activeTab === 'ipa' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>IPA</button>
          <button onClick={() => setActiveTab('vocab')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${activeTab === 'vocab' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>Từ vựng</button>
          <button onClick={() => setActiveTab('grammar')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${activeTab === 'grammar' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>Cấu trúc</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ipa' && <div className="h-full overflow-y-auto custom-scrollbar">{renderIPA()}</div>}
        {activeTab === 'vocab' && renderPracticeList(vocabByLesson)}
        {activeTab === 'grammar' && renderPracticeList(grammarByLesson)}
      </div>
    </div>
  );
};

export default NailSpeakHub;
