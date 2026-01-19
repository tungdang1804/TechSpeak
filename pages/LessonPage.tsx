
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

  const toggleVariations = (lineId: string) => {
    setExpandedVariations(prev => ({
      ...prev,
      [lineId]: !prev[lineId]
    }));
  };

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 relative z-[80] bg-white shadow-sm">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <X size={24} />
        </button>
        
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
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-down py-2 z-[90]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-3 border-b border-slate-50">Lộ trình bài học</p>
              <div className="max-h-[60dvh] overflow-y-auto no-scrollbar">
                {allLessons.map((l) => (
                  <button key={l.id} onClick={() => handleLessonSwitch(l.id)}
                    className={`w-full px-6 py-5 flex items-center gap-4 text-left border-b last:border-0 border-slate-50 transition-colors
                      ${l.id === lesson.id ? 'bg-app-primary/10' : 'hover:bg-slate-50 active:bg-slate-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm
                      ${l.id === lesson.id ? 'bg-app-primary text-white shadow-lg shadow-app-primary/10' : 'bg-slate-100 text-slate-400'}`}>
                      {l.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-black truncate ${l.id === lesson.id ? 'text-app-primary' : 'text-app-text'}`}>{l.title}</p>
                      <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-tight">{l.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
        {(['situation', 'vocab', 'grammar', 'roleplay'] as TabView[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all shadow-sm
              ${activeTab === tab ? 'bg-app-primary text-white shadow-app-primary/20 border-app-primary' : 'bg-white text-slate-400 border border-slate-100 hover:text-app-primary'}`}
          >
            {tab === 'situation' && <Layers size={16} />}
            {tab === 'vocab' && <BookOpen size={16} />}
            {tab === 'grammar' && <Type size={16} />}
            {tab === 'roleplay' && <Sparkles size={16} />}
            {tab === 'situation' ? 'Bài học' : tab === 'vocab' ? 'Từ vựng' : tab === 'grammar' ? 'Cấu trúc' : 'Thực chiến'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-app-bg/50">
        {activeTab === 'situation' && (
          <div className="p-5 space-y-10 pb-32">
            {/* Context Summary */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="header-gradient px-8 py-5 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                     <Flag size={14} /> BỐI CẢNH
                  </h3>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black text-white/90 uppercase tracking-tighter">
                    Technical Mastery
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <p className="text-base text-app-text leading-relaxed font-bold italic">"{lesson.contextBackground}"</p>
                  <div className="bg-app-primary/5 p-6 rounded-[32px] border border-app-primary/10">
                     <h4 className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Target size={14} /> MỤC TIÊU CỐT LÕI
                     </h4>
                     <p className="text-sm text-app-text font-bold leading-relaxed">{lesson.contextGoal}</p>
                  </div>
               </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-12">
              {lesson.steps.map((step, sIdx) => (
                <div key={step.id} className="relative">
                  {/* Step Connector Line */}
                  {sIdx < lesson.steps.length - 1 && (
                    <div className="absolute left-[23px] top-[48px] bottom-[-48px] w-0.5 bg-app-primary/10"></div>
                  )}
                  
                  {/* Step Header Section */}
                  <div className="flex gap-6 mb-8 items-start">
                    <div className="w-12 h-12 rounded-[20px] bg-app-primary text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-app-primary/10 z-10 border-4 border-white">
                      {sIdx + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-black text-app-text leading-tight mb-2">
                        {step.title}
                      </h4>
                      <div className="inline-block bg-white border border-app-primary/10 px-4 py-2 rounded-2xl">
                        <p className="text-[11px] text-slate-500 font-black italic">
                          {step.purpose}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dialogue Lines within Step */}
                  <div className="space-y-10 pl-4">
                    {step.lines.map((line) => {
                      const isTech = line.speaker === 'Tech' || line.speaker === 'Student';
                      const hasVariations = line.variations && line.variations.length > 0;
                      const isExpanded = expandedVariations[line.id];
                      
                      return (
                        <div key={line.id} className={`flex flex-col w-full ${isTech ? 'items-end' : 'items-start'}`}>
                          <div className={`flex gap-4 max-w-[95%] ${isTech ? 'flex-row-reverse self-end' : 'self-start'}`}>
                            {/* Avatar/Label */}
                            <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-[10px] shadow-sm mt-1 border-2
                              ${isTech ? 'bg-app-primary text-white border-white' : 'bg-slate-200 text-slate-500 border-white'}`}>
                              {line.speaker === 'Student' ? 'H.V' : (isTech ? 'T' : 'KH')}
                            </div>
                            
                            {/* Bubble */}
                            <div className={`rounded-[32px] p-6 border shadow-sm transition-all group relative
                              ${isTech ? 'bg-white border-app-primary/20 rounded-tr-none' : 'bg-app-text border-slate-800 text-white rounded-tl-none'}`}>
                              <p className={`font-black text-base leading-snug ${isTech ? 'text-app-text' : 'text-white'}`}>
                                {line.text}
                              </p>
                              <p className={`text-[12px] font-bold italic mt-3 ${isTech ? 'text-slate-400' : 'text-slate-400'}`}>
                                {line.translation}
                              </p>
                              
                              {/* Actions Bar */}
                              <div className={`flex items-center gap-4 mt-5 pt-4 border-t ${isTech ? 'border-slate-50' : 'border-white/10'}`}>
                                <button onClick={() => playAudio(line.text)} className={`p-2 rounded-xl transition-colors ${isTech ? 'bg-app-primary/10 text-app-primary' : 'bg-white/10 text-white/60'}`}>
                                  <Volume2 size={18} />
                                </button>
                                {isTech && (
                                  <button onClick={() => openRecordModal(line.text, line.id)} 
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                      ${getBestScore(line.text) >= 75 ? 'bg-green-100 text-green-700' : 'bg-app-primary text-white shadow-xl shadow-app-primary/10'}`}>
                                    <Mic size={14} /> 
                                    {getBestScore(line.text) > 0 ? `${getBestScore(line.text)}đ` : 'LUYỆN NÓI'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Variations Container */}
                          {isTech && hasVariations && (
                            <div className="flex flex-col items-end w-full pr-14 mt-4">
                              <button 
                                onClick={() => toggleVariations(line.id)}
                                className="flex items-center gap-2 py-2 px-5 rounded-full bg-app-primary/5 text-app-primary border border-app-primary/10 hover:bg-app-primary/10 transition-all active:scale-95"
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  {isExpanded ? 'Ẩn phương án khác' : `+${line.variations?.length} mẫu câu tương đương`}
                                </span>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>

                              {isExpanded && (
                                <div className="w-full space-y-4 mt-5 animate-fade-in origin-top">
                                  {line.variations?.map((v, idx) => (
                                    <div key={v.id} className="bg-white border border-app-primary/10 rounded-[28px] p-6 shadow-sm hover:border-app-primary/30 transition-all">
                                      <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                          <p className="text-base font-black text-app-text leading-snug mb-2">{v.text}</p>
                                          <p className="text-xs text-slate-400 italic font-bold">{v.translation}</p>
                                        </div>
                                        <button onClick={() => playAudio(v.text)} className="w-10 h-10 flex items-center justify-center bg-app-primary/5 text-app-primary rounded-xl">
                                          <Volume2 size={20} />
                                        </button>
                                      </div>
                                      <div className="mt-5">
                                        <button onClick={() => openRecordModal(v.text, v.id)} 
                                          className="w-full py-3 rounded-2xl bg-app-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-app-primary/10 active:scale-95 transition-all">
                                          Luyện tập câu này
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
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
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pro-Tip</h3>
              <p className="text-sm font-bold text-app-text">Ghi nhớ cách phát âm (IPA) để khách hàng dễ hiểu bạn hơn.</p>
            </div>
            {lesson.vocabularies.map((v) => (
              <div key={v.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-app-primary/30 transition-colors group">
                <div className="flex-1 pr-4">
                  <h4 className="font-black text-app-primary text-lg mb-1">{v.word}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {v.ipa}
                    </span>
                  </div>
                  <p className="text-sm font-black text-app-text">{v.translation}</p>
                </div>
                <button onClick={() => playAudio(v.word)} className="w-14 h-14 bg-app-primary/5 text-app-primary rounded-[22px] flex items-center justify-center active:scale-90 transition-transform">
                  <Volume2 size={28} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="p-6 space-y-6 pb-32">
            {lesson.grammarPoints.map(gp => (
              <div key={gp.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-app-text p-6 border-b border-slate-800">
                  <h4 className="font-black text-app-secondary text-xs uppercase tracking-[0.2em]">{gp.title}</h4>
                </div>
                <div className="p-8 space-y-6">
                  <p className="text-sm text-slate-500 leading-relaxed font-bold">{gp.description}</p>
                  <div className="space-y-4">
                    {gp.examples.map((ex, i) => (
                      <div key={i} className="flex justify-between items-center bg-app-primary/5 p-6 rounded-[28px] border border-app-primary/10 group active:bg-app-primary/10 transition-colors">
                        <div className="pr-4 flex-1">
                          <p className="text-base font-black text-app-text mb-1">{ex.english}</p>
                          <p className="text-[11px] text-slate-400 italic font-bold">{ex.vietnamese}</p>
                        </div>
                        <button onClick={() => playAudio(ex.english)} className="w-10 h-10 flex items-center justify-center bg-white text-app-primary rounded-xl shadow-sm">
                          <Volume2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roleplay' && <AIRoleplay scenarioContext={lesson.roleplayPrompt} userScenario={lesson.roleplayScenario} />}
      </div>

      {/* Modern Practice Modal Overlay */}
      {recordModalOpen && phraseToRecord && (
        <div 
          className="fixed inset-0 z-[100] bg-app-text/60 backdrop-blur-md flex items-end justify-center animate-fade-in"
          onClick={() => setRecordModalOpen(false)}
        >
           <div 
             className="bg-white rounded-t-[48px] w-full max-w-md shadow-2xl animate-slide-up-modal flex flex-col h-[85dvh]"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="shrink-0 pt-6 px-10 border-b border-slate-50 bg-white rounded-t-[48px] sticky top-0 z-20">
                <div className="flex justify-center mb-6"><div className="w-16 h-1.5 bg-slate-100 rounded-full"></div></div>
                <div className="flex justify-between items-center pb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Pronunciation Lab</span>
                    <span className="text-xs font-black text-app-primary uppercase">Phân tích giọng nói AI</span>
                  </div>
                  <button onClick={() => setRecordModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full active:scale-90 transition-transform">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-8 pb-24">
                <NailSpeakScore 
                  targetText={phraseToRecord.text} 
                  bestScore={getBestScore(phraseToRecord.text)} 
                  onScoreUpdate={(score) => handleScoreUpdate(phraseToRecord.text, score)} 
                />
                <button onClick={() => setRecordModalOpen(false)} className="w-full mt-12 py-6 bg-app-primary text-white font-black text-xs rounded-3xl uppercase tracking-[0.2em] shadow-2xl shadow-app-primary/20 active:scale-95 transition-all">
                  Hoàn thành buổi tập
                </button>
              </div>
           </div>
        </div>
      )}
      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up-modal {
          animation: slideUpModal 0.5s cubic-bezier(0.1, 0.7, 0.1, 1);
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LessonPage;
