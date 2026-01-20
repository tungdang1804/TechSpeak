
import React, { useState, useMemo } from 'react';
import { IPA_SOUNDS } from '../constants';
import { SPECIALIZED_VOCAB } from '../data/specialVocab';
import { UserProgress, IPASound, Lesson } from '../types';
import { ArrowLeft, Volume2, ChevronDown, Library, Info, Mic2, Grid } from 'lucide-react';
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

const NailSpeakHub: React.FC<NailSpeakHubProps> = ({ lessons, onBack, progress, onScoreUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ipa');
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [selectedIPASound, setSelectedIPASound] = useState<IPASound | null>(null);
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>("special_0");

  const vocabByLesson = useMemo<PracticeGroup[]>(() => {
    const specializedGroups: PracticeGroup[] = SPECIALIZED_VOCAB.map((group, idx) => ({
      lessonTitle: group.title,
      icon: group.icon,
      isSpecialized: true,
      items: group.subGroups.flatMap(sg => sg.items.map(item => ({ ...item, tag: sg.name })))
    }));

    const lessonVocab: PracticeGroup[] = lessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.vocabularies?.map(v => ({ id: v.id, text: v.word, sub: v.translation, ipa: v.ipa })) || []
    })).filter(group => group.items.length > 0);

    return [...specializedGroups, ...lessonVocab];
  }, [lessons]);

  const grammarByLesson = useMemo<PracticeGroup[]>(() => {
    return lessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.grammar_points?.flatMap(gp => gp.examples.map((ex, idx) => ({ id: `${gp.id}_${idx}`, text: ex.english, sub: ex.vietnamese, tag: gp.title }))) || []
    })).filter(group => group.items.length > 0);
  }, [lessons]);

  const renderPracticeList = (groups: PracticeGroup[]) => (
    <div className="flex flex-col h-full bg-app-bg">
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {groups.map((group, groupIdx) => {
          const key = group.isSpecialized ? `special_${groupIdx}` : `lesson_${groupIdx}`;
          const isOpen = expandedGroupKey === key;
          return (
            <div key={key} className={`bg-white rounded-3xl soft-shadow border overflow-hidden transition-all duration-300 ${group.isSpecialized ? 'border-app-accent/30' : 'border-white/50'}`}>
              <button onClick={() => setExpandedGroupKey(isOpen ? null : key)} className={`w-full flex items-center justify-between p-4 text-left ${isOpen ? 'bg-app-primary/5' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isOpen ? 'bg-app-primary text-white' : 'bg-slate-50 text-slate-400'}`}>{group.isSpecialized ? '★' : groupIdx + 1}</div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] block mb-0.5 text-slate-400">{group.isSpecialized ? "CHUYÊN NGÀNH" : "BÀI HỌC"}</span>
                    <h3 className="font-black text-app-text text-sm">{group.lessonTitle}</h3>
                  </div>
                </div>
                <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-3 bg-slate-50/50 border-t grid grid-cols-2 gap-2 animate-fade-in">
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => setSelectedItem(item)} className={`p-3.5 rounded-2xl border text-left transition-all ${selectedItem?.id === item.id ? 'bg-white border-app-primary ring-2 ring-app-primary/5' : 'bg-white border-slate-100'}`}>
                      <p className={`font-black text-xs mb-1 ${selectedItem?.id === item.id ? 'text-app-primary' : 'text-app-text'}`}>{item.text}</p>
                      <p className="text-[10px] text-slate-300 font-bold uppercase">{item.sub}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {selectedItem && (
          <div className="mt-6 w-full animate-fade-in pb-10">
             <div className="bg-white p-6 rounded-[32px] soft-shadow text-center border">
                <p className="text-lg text-app-text font-black mb-6">"{selectedItem.sub}"</p>
                <NailSpeakScore targetText={selectedItem.text} bestScore={progress.bestScores[selectedItem.text] || 0} onScoreUpdate={(s) => onScoreUpdate(selectedItem.text, s)} />
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderIPAList = () => {
    const vowels = IPA_SOUNDS.filter(s => s.type === 'vowel');
    const diphthongs = IPA_SOUNDS.filter(s => s.type === 'diphthong');
    const consonants = IPA_SOUNDS.filter(s => s.type === 'consonant');

    // Added key property to the type definition to avoid TS error during mapping in the JSX return
    const IPACell = ({ sound, colorClass }: { sound: IPASound, colorClass: string, key?: React.Key }) => (
      <button 
        onClick={() => {
          setSelectedIPASound(sound);
          setSelectedItem(null);
          playAudio(sound.examples[0].word, 'fast'); // Phát nhanh cho từ đơn
        }}
        className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl border transition-all active:scale-95 
          ${selectedIPASound?.symbol === sound.symbol 
            ? `${colorClass} text-white border-transparent shadow-lg ring-2 ring-offset-1` 
            : 'bg-white text-app-text border-slate-100 hover:border-slate-200'}`}
      >
        <span className="text-lg font-black italic">/{sound.symbol}/</span>
        <span className={`text-[7px] font-bold uppercase tracking-tighter mt-1 opacity-60 ${selectedIPASound?.symbol === sound.symbol ? 'text-white' : 'text-slate-400'}`}>
          {sound.examples[0].word}
        </span>
      </button>
    );

    return (
      <div className="flex flex-col h-full bg-app-bg overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-32">
          {/* Vowels (Monophthongs) - Teal/Cyan Palette */}
          <div className="mb-8">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Monophthongs (Nguyên âm đơn)</h4>
            <div className="grid grid-cols-4 gap-2">
              {vowels.map((s, i) => <IPACell key={i} sound={s} colorClass="bg-teal-500" />)}
            </div>
          </div>

          {/* Diphthongs - Purple Palette */}
          <div className="mb-8">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Diphthongs (Nguyên âm đôi)</h4>
            <div className="grid grid-cols-4 gap-2">
              {diphthongs.map((s, i) => <IPACell key={i} sound={s} colorClass="bg-indigo-500" />)}
            </div>
          </div>

          {/* Consonants - Muted Pink/Red Palette */}
          <div className="mb-8">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Consonants (Phụ âm)</h4>
            <div className="grid grid-cols-4 gap-2">
              {consonants.map((s, i) => <IPACell key={i} sound={s} colorClass="bg-rose-400" />)}
            </div>
          </div>

          {/* Practice Section for Selected Sound */}
          {selectedIPASound && (
            <div className="mt-4 animate-slide-up-modal">
              <div className="bg-white rounded-[32px] soft-shadow border overflow-hidden">
                <div className="bg-slate-50 p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl font-black text-slate-800 italic shadow-sm border border-slate-100">
                        /{selectedIPASound.symbol}/
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">{selectedIPASound.name || 'Pronunciation'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold italic">{selectedIPASound.description}</p>
                      </div>
                   </div>
                   <button onClick={() => playAudio(selectedIPASound.examples[0].word, 'fast')} className="w-10 h-10 bg-white text-app-primary rounded-full flex items-center justify-center border shadow-sm">
                      <Volume2 size={20} />
                   </button>
                </div>

                <div className="p-4 space-y-2">
                  {selectedIPASound.examples.map((ex, exIdx) => {
                    const isPracticing = selectedItem?.text === ex.word;
                    return (
                      <div key={exIdx} className="space-y-3">
                        <button 
                          onClick={() => setSelectedItem({ id: `ipa_${exIdx}`, text: ex.word, sub: ex.meaning })}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isPracticing ? 'border-app-primary bg-app-primary/5' : 'bg-white border-slate-50'}`}
                        >
                          <div className="text-left">
                            <p className="font-black text-sm">{ex.word}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{ex.ipa} • {ex.meaning}</p>
                          </div>
                          <Mic2 size={16} className={isPracticing ? 'text-app-primary' : 'text-slate-300'} />
                        </button>
                        {isPracticing && (
                          <div className="p-4 border-2 border-app-primary/10 rounded-[28px] animate-fade-in">
                             <NailSpeakScore targetText={ex.word} bestScore={progress.bestScores[ex.word] || 0} onScoreUpdate={(s) => onScoreUpdate(ex.word, s)} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      <div className="bg-white pt-4 pb-2 px-4 shrink-0 border-b">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400"><ArrowLeft size={24} /></button>
          <div className="flex items-center gap-2 text-app-primary font-black text-lg tracking-tight"><Library size={20} /> Thư viện Star Spa</div>
          <div className="w-10"></div>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => { setActiveTab('ipa'); setSelectedItem(null); }} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ipa' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>IPA</button>
          <button onClick={() => { setActiveTab('vocab'); setSelectedItem(null); }} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'vocab' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>Từ vựng</button>
          <button onClick={() => { setActiveTab('grammar'); setSelectedItem(null); }} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'grammar' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>Cấu trúc</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ipa' && renderIPAList()}
        {activeTab === 'vocab' && renderPracticeList(vocabByLesson)}
        {activeTab === 'grammar' && renderPracticeList(grammarByLesson)}
      </div>
    </div>
  );
};

export default NailSpeakHub;
