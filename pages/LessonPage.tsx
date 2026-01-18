
import React, { useState } from 'react';
import { Lesson, ScriptLine } from '../types';
import { X, Volume2, Mic, Layers, BookOpen, Type, Sparkles, MapPin, Target, Users, ChevronDown, ListFilter, ChevronUp } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-white">
      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 relative z-[80]">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <X size={24} />
        </button>
        
        <button onClick={() => setLessonListOpen(!lessonListOpen)} className="flex flex-col items-center group active:scale-95 transition-transform">
          <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest flex items-center gap-1">
            Bài {lesson.order} <ChevronDown size={10} className={`transition-transform duration-300 ${lessonListOpen ? 'rotate-180' : ''}`} />
          </span>
          <h2 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[180px] text-center">{lesson.title}</h2>
        </button>
        
        <div className="w-10"></div>

        {lessonListOpen && (
          <>
            <div className="fixed inset-0 bg-black/20" onClick={() => setLessonListOpen(false)}></div>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-down py-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-2">Chọn bài học</p>
              {allLessons.map((l) => (
                <button key={l.id} onClick={() => handleLessonSwitch(l.id)}
                  className={`w-full px-5 py-4 flex items-center gap-4 text-left border-b last:border-0 border-slate-50 transition-colors
                    ${l.id === lesson.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs
                    ${l.id === lesson.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {l.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${l.id === lesson.id ? 'text-indigo-600' : 'text-slate-800'}`}>{l.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{l.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
        {(['situation', 'vocab', 'grammar', 'roleplay'] as TabView[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all shadow-sm
              ${activeTab === tab ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
            {tab === 'situation' && <Layers size={18} />}
            {tab === 'vocab' && <BookOpen size={18} />}
            {tab === 'grammar' && <Type size={18} />}
            {tab === 'roleplay' && <Sparkles size={18} />}
            {tab === 'situation' ? 'Tình huống' : tab === 'vocab' ? 'Từ vựng' : tab === 'grammar' ? 'Ngữ pháp' : 'Thực chiến'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'situation' && (
          <div className="p-4 space-y-6 pb-20">
            {/* Briefing Card */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-8">
               <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-50">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                     <MapPin size={14} /> Bối cảnh (Star Spa)
                  </h3>
               </div>
               <div className="p-6 space-y-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{lesson.contextBackground}</p>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={12} /> Mục tiêu
                     </h4>
                     <p className="text-xs text-slate-700 font-medium leading-relaxed">{lesson.contextGoal}</p>
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users size={12} /> Nhân vật
                     </h4>
                     {lesson.contextCharacters.map((char, idx) => (
                       <div key={idx} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-[10px]">{char.name.charAt(0)}</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{char.name}</p>
                            <p className="text-[11px] text-slate-400">{char.role}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Conversation Area */}
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Kịch bản chi tiết</h3>
                <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-full">
                  <ListFilter size={10} /> Đa phương án
                </div>
              </div>

              {lesson.situationScript.map((line) => {
                const isTech = line.speaker === 'Tech' || line.speaker === 'Student';
                const hasVariations = line.variations && line.variations.length > 0;
                const isExpanded = expandedVariations[line.id];
                
                return (
                  <div key={line.id} className={`space-y-3 ${isTech ? 'items-end' : 'items-start'} flex flex-col w-full`}>
                    <div className={`flex gap-3 max-w-[90%] ${isTech ? 'flex-row-reverse self-end' : 'self-start'}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-[10px] shadow-sm mt-1
                        ${isTech ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {line.speaker === 'Student' ? 'M' : (isTech ? 'T' : 'KH')}
                      </div>
                      <div className={`rounded-2xl p-4 border shadow-sm
                        ${isTech ? 'bg-indigo-50/50 border-indigo-100 rounded-tr-none' : 'bg-white border-slate-100 rounded-tl-none'}`}>
                        <p className="font-bold text-slate-800 text-[13px] leading-snug">{line.text}</p>
                        <p className="text-[11px] text-slate-400 italic mt-1">{line.translation}</p>
                        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100/30">
                          <button onClick={() => playAudio(line.text)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"><Volume2 size={14} /></button>
                          {isTech && (
                            <button onClick={() => openRecordModal(line.text, line.id)} 
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${getBestScore(line.text) >= 75 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                              <Mic size={10} className="inline mr-1" /> {getBestScore(line.text) > 0 ? `${getBestScore(line.text)}đ` : 'Luyện'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isTech && hasVariations && (
                      <div className="flex flex-col items-end w-full pr-11">
                        <button 
                          onClick={() => toggleVariations(line.id)}
                          className="flex items-center gap-1.5 py-1 px-3 mt-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors active:scale-95"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            {isExpanded ? 'Ẩn các mẫu câu khác' : `${line.variations?.length} phương án khác`}
                          </span>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {isExpanded && (
                          <div className="w-full space-y-4 mt-4 animate-fade-in origin-top">
                            {line.variations?.map((v, idx) => (
                              <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm overflow-hidden flex flex-col group transition-all">
                                <div className="p-4 pb-2 flex justify-between items-start gap-3">
                                  <div className="flex-1">
                                    <p className="text-[14px] font-bold text-slate-800 leading-snug mb-1">{v.text}</p>
                                    <p className="text-[12px] text-slate-400 italic font-medium leading-relaxed">
                                      {v.translation}
                                    </p>
                                  </div>
                                  <button 
                                    onClick={() => playAudio(v.text)} 
                                    className="p-2 text-indigo-400 bg-indigo-50/50 rounded-lg hover:text-indigo-600 transition-colors"
                                  >
                                    <Volume2 size={18} />
                                  </button>
                                </div>

                                <div className="px-4 py-3 flex items-center justify-between border-t border-slate-50">
                                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">VARIATION {idx + 1}</span>
                                  <button 
                                    onClick={() => openRecordModal(v.text, v.id)} 
                                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95
                                      ${getBestScore(v.text) >= 75 
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}
                                  >
                                    {getBestScore(v.text) > 0 ? `Đạt ${getBestScore(v.text)}đ` : 'LUYỆN TẬP'}
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
        )}
        {/* Vocab, Grammar, Roleplay tabs stay the same */}
        {activeTab === 'vocab' && (
          <div className="p-4 grid grid-cols-1 gap-3 pb-20">
            {lesson.vocabularies.map((v) => (
              <div key={v.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
                <div>
                  <h4 className="font-bold text-indigo-600">{v.word}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{v.ipa}</p>
                  <p className="text-sm font-medium text-slate-600 mt-1">{v.translation}</p>
                </div>
                <button onClick={() => playAudio(v.word)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                  <Volume2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'grammar' && (
          <div className="p-4 space-y-4 pb-20">
            {lesson.grammarPoints.map(gp => (
              <div key={gp.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100"><h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{gp.title}</h4></div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">{gp.description}</p>
                  <div className="space-y-2">
                    {gp.examples.map((ex, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl">
                        <div className="pr-4">
                          <p className="text-sm font-bold text-slate-700">{ex.english}</p>
                          <p className="text-[11px] text-slate-400 italic">{ex.vietnamese}</p>
                        </div>
                        <button onClick={() => playAudio(ex.english)} className="text-slate-300"><Volume2 size={16} /></button>
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

      {recordModalOpen && phraseToRecord && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-in">
           <div className="bg-white rounded-t-[40px] w-full max-w-md p-8 pb-12 shadow-2xl animate-slide-up-modal">
              <div className="flex justify-center mb-6"><div className="w-12 h-1.5 bg-slate-200 rounded-full"></div></div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Luyện phát âm</span>
                <button onClick={() => setRecordModalOpen(false)} className="text-slate-300 hover:text-slate-600"><X size={20} /></button>
              </div>
              <NailSpeakScore targetText={phraseToRecord.text} bestScore={getBestScore(phraseToRecord.text)} onScoreUpdate={(score) => handleScoreUpdate(phraseToRecord.text, score)} />
           </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
