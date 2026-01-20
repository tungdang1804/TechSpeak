
import React, { useState } from 'react';
import { Lesson, LessonStep, ScriptLine } from '../types';
import { X, Volume2, Mic, Layers, BookOpen, Type, Sparkles, MapPin, Target, Users, ChevronDown, ListFilter, ChevronUp, Flag, ArrowRight } from 'lucide-react';
import NailSpeakScore from '../components/NailSpeakScore';
import AIRoleplay from '../components/AIRoleplay';
import { playAudio } from '../utils/audioUtils';

interface LessonPageProps {
  lesson: Lesson;
  allLessons: Lesson[];
  onSelectLesson: (id: string) => void;
  onBack: () => void;
  onComplete: (id: string, scores: Record<string, number>) => void;
  savedScores: Record<string, number>;
}

type TabView = 'situation' | 'vocab' | 'grammar' | 'roleplay';

const LessonPage: React.FC<LessonPageProps> = ({ lesson, allLessons, onSelectLesson, onBack, savedScores }) => {
  const [activeTab, setActiveTab] = useState<TabView>('situation');
  const [sessionScores, setSessionScores] = useState<Record<string, number>>({});
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [phraseToRecord, setPhraseToRecord] = useState<{ text: string, id: string } | null>(null);
  const [lessonListOpen, setLessonListOpen] = useState(false);
  const [expandedVariations, setExpandedVariations] = useState<Record<string, boolean>>({});

  const handleScoreUpdate = (text: string, score: number) => {
    setSessionScores(prev => ({
      ...prev,
      [text]: Math.max(score, prev[text] || 0, savedScores[text] || 0)
    }));
  };

  const getBestScore = (text: string) => Math.max(sessionScores[text] || 0, savedScores[text] || 0);

  const openRecordModal = (text: string, id: string) => {
    setPhraseToRecord({ text, id });
    setRecordModalOpen(true);
  };

  const handleLessonSwitch = (id: string) => {
    onSelectLesson(id);
    setLessonListOpen(false);
    setActiveTab('situation');
    setExpandedVariations({}); 
  };

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 relative z-[80] bg-white shadow-sm">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
        <button onClick={() => setLessonListOpen(!lessonListOpen)} className="flex flex-col items-center group active:scale-95 transition-transform">
          <span className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] flex items-center gap-1">
            BÀI {lesson.order} <ChevronDown size={12} className={`transition-transform duration-300 ${lessonListOpen ? 'rotate-180' : ''}`} />
          </span>
          <h2 className="text-sm font-black text-app-text line-clamp-1 max-w-[180px] text-center">{lesson.title}</h2>
        </button>
        <div className="w-10"></div>
        {lessonListOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setLessonListOpen(false)}></div>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden py-2 z-[90]">
              <div className="max-h-[60dvh] overflow-y-auto no-scrollbar">
                {allLessons.map((l) => (
                  <button key={l.id} onClick={() => handleLessonSwitch(l.id)}
                    className={`w-full px-6 py-5 flex items-center gap-4 text-left border-b last:border-0 border-slate-50 transition-colors ${l.id === lesson.id ? 'bg-app-primary/10' : 'hover:bg-slate-50'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${l.id === lesson.id ? 'bg-app-primary text-white' : 'bg-slate-100 text-slate-400'}`}>{l.order}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-black truncate ${l.id === lesson.id ? 'text-app-primary' : 'text-app-text'}`}>{l.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
        {(['situation', 'vocab', 'grammar', 'roleplay'] as TabView[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-app-primary text-white shadow-lg shadow-app-primary/20' : 'bg-white text-slate-400 border border-slate-100'}`}>
            {tab === 'situation' ? 'Bài học' : tab === 'vocab' ? 'Từ vựng' : tab === 'grammar' ? 'Cấu trúc' : 'Thực chiến'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-app-bg/50">
        {activeTab === 'situation' && (
          <div className="p-5 space-y-10 pb-32">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
               <div className="header-gradient px-8 py-5 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Flag size={14} /> BỐI CẢNH</h3>
               </div>
               <div className="p-8 space-y-6">
                  <p className="text-base text-app-text leading-relaxed font-bold italic">"{lesson.context?.background}"</p>
                  <div className="bg-app-primary/5 p-6 rounded-[32px] border border-app-primary/10">
                     <h4 className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Target size={14} /> MỤC TIÊU</h4>
                     <p className="text-sm text-app-text font-bold leading-relaxed">{lesson.context?.goal}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-12">
              {lesson.steps?.map((step, sIdx) => (
                <div key={step.id} className="relative">
                  <div className="flex gap-6 mb-8 items-start">
                    <div className="w-12 h-12 rounded-[20px] bg-app-primary text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg border-4 border-white">{sIdx + 1}</div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-black text-app-text leading-tight mb-2">{step.title}</h4>
                      <div className="inline-block bg-white border border-app-primary/10 px-4 py-2 rounded-2xl"><p className="text-[11px] text-slate-500 font-black italic">{step.purpose}</p></div>
                    </div>
                  </div>
                  <div className="space-y-10 pl-4">
                    {step.lines.map((line) => {
                      const isTech = line.speaker === 'Tech' || line.speaker === 'Student';
                      return (
                        <div key={line.id} className={`flex flex-col w-full ${isTech ? 'items-end' : 'items-start'}`}>
                          <div className={`flex gap-4 max-w-[95%] ${isTech ? 'flex-row-reverse self-end' : 'self-start'}`}>
                            <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-[10px] border-2 ${isTech ? 'bg-app-primary text-white border-white' : 'bg-slate-200 text-slate-500 border-white'}`}>{isTech ? 'T' : 'KH'}</div>
                            <div className={`rounded-[32px] p-6 border shadow-sm transition-all group relative ${isTech ? 'bg-white border-app-primary/20 rounded-tr-none' : 'bg-app-text border-slate-800 text-white rounded-tl-none'}`}>
                              <p className={`font-black text-base leading-snug ${isTech ? 'text-app-text' : 'text-white'}`}>{line.text}</p>
                              <p className="text-[12px] font-bold italic mt-3 text-slate-400">{line.translation}</p>
                              <div className={`flex items-center gap-4 mt-5 pt-4 border-t ${isTech ? 'border-slate-50' : 'border-white/10'}`}>
                                <button onClick={() => playAudio(line.text)} className={`p-2 rounded-xl ${isTech ? 'bg-app-primary/10 text-app-primary' : 'bg-white/10 text-white/60'}`}><Volume2 size={18} /></button>
                                {isTech && <button onClick={() => openRecordModal(line.text, line.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-app-primary text-white shadow-lg"><Mic size={14} /> LUYỆN NÓI</button>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'vocab' && (
          <div className="p-6 grid grid-cols-1 gap-4 pb-32">
            {lesson.vocabularies?.map((v) => (
              <div key={v.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="flex-1 pr-4">
                  <h4 className="font-black text-app-primary text-lg mb-1">{v.word}</h4>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">{v.ipa}</span>
                  <p className="text-sm font-black text-app-text mt-2">{v.translation}</p>
                </div>
                <button onClick={() => playAudio(v.word)} className="w-14 h-14 bg-app-primary/5 text-app-primary rounded-[22px] flex items-center justify-center shadow-inner"><Volume2 size={28} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="p-6 space-y-6 pb-32">
            {lesson.grammar_points?.map(gp => (
              <div key={gp.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-app-text p-6 border-b border-slate-800"><h4 className="font-black text-app-secondary text-xs uppercase tracking-[0.2em]">{gp.title}</h4></div>
                <div className="p-8 space-y-6">
                  <p className="text-sm text-slate-500 leading-relaxed font-bold">{gp.description}</p>
                  <div className="space-y-4">
                    {gp.examples.map((ex, i) => (
                      <div key={i} className="flex justify-between items-center bg-app-primary/5 p-6 rounded-[28px] border border-app-primary/10 transition-colors">
                        <div className="pr-4 flex-1">
                          <p className="text-base font-black text-app-text mb-1">{ex.english}</p>
                          <p className="text-[11px] text-slate-400 italic font-bold">{ex.vietnamese}</p>
                        </div>
                        <button onClick={() => playAudio(ex.english)} className="w-10 h-10 flex items-center justify-center bg-white text-app-primary rounded-xl shadow-sm"><Volume2 size={20} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roleplay' && (
          <AIRoleplay 
            scenarioContext={lesson.roleplay?.ai_instructions || ""} 
            userScenario={lesson.roleplay?.user_instructions || ""} 
          />
        )}
      </div>

      {recordModalOpen && phraseToRecord && (
        <div className="fixed inset-0 z-[100] bg-app-text/60 backdrop-blur-md flex items-end justify-center animate-fade-in" onClick={() => setRecordModalOpen(false)}>
           <div className="bg-white rounded-t-[48px] w-full max-w-md shadow-2xl animate-slide-up-modal flex flex-col h-[85dvh]" onClick={(e) => e.stopPropagation()}>
              <div className="shrink-0 pt-6 px-10 border-b border-slate-50 bg-white rounded-t-[48px] sticky top-0 z-20">
                <div className="flex justify-center mb-6"><div className="w-16 h-1.5 bg-slate-100 rounded-full"></div></div>
                <div className="flex justify-between items-center pb-6">
                  <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Pronunciation Lab</span></div>
                  <button onClick={() => setRecordModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full"><X size={24} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-8 pb-24">
                <NailSpeakScore targetText={phraseToRecord.text} bestScore={getBestScore(phraseToRecord.text)} onScoreUpdate={(score) => handleScoreUpdate(phraseToRecord.text, score)} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
