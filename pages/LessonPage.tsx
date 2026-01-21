
import React, { Suspense, lazy } from 'react';
import { Lesson } from '../types';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import NailSpeakScore from '../components/NailSpeakScore';
import VocabModal from '../components/VocabModal';
import { useLessonLogic } from '../hooks/useLessonLogic';

const LessonSituationView = lazy(() => import('../components/lesson/LessonSituationView'));
const LessonVocabView = lazy(() => import('../components/lesson/LessonVocabView'));
const LessonGrammarView = lazy(() => import('../components/lesson/LessonGrammarView'));

interface LessonPageProps {
  lesson: Lesson;
  allLessons: Lesson[];
  onSelectLesson: (id: string) => void;
  onBack: () => void;
  savedScores: Record<string, number>;
}

const LessonPage: React.FC<LessonPageProps> = ({ lesson, allLessons, onSelectLesson, onBack, savedScores }) => {
  const logic = useLessonLogic(lesson, savedScores);

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-hidden">
      {logic.selectedLookupWord && (
        <VocabModal word={logic.selectedLookupWord} existingVocab={lesson.vocabularies} onClose={() => logic.setSelectedLookupWord(null)} />
      )}

      <div className="px-4 py-3 flex items-center justify-between border-b shrink-0 bg-white shadow-sm z-50">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={24} /></button>
        <button onClick={() => logic.setLessonListOpen(!logic.lessonListOpen)} className="flex flex-col items-center">
          <span className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] flex items-center gap-1">
            BÀI {lesson.order} <ChevronDown size={12} className={logic.lessonListOpen ? 'rotate-180' : ''} />
          </span>
          <h2 className="text-sm font-black text-app-text line-clamp-1 max-w-[180px] text-center">{lesson.title}</h2>
        </button>
        <div className="w-10" />
        {logic.lessonListOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80]" onClick={() => logic.setLessonListOpen(false)} />
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[32px] shadow-2xl border py-2 z-[90]">
              <div className="max-h-[60dvh] overflow-y-auto no-scrollbar">
                {allLessons.map((l) => (
                  <button key={l.id} onClick={() => { onSelectLesson(l.id); logic.setLessonListOpen(false); }}
                    className={`w-full px-6 py-5 flex items-center gap-4 text-left border-b last:border-0 ${l.id === lesson.id ? 'bg-app-primary/10' : ''}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${l.id === lesson.id ? 'bg-app-primary text-white' : 'bg-slate-100 text-slate-400'}`}>{l.order}</div>
                    <p className={`text-sm font-black truncate ${l.id === lesson.id ? 'text-app-primary' : 'text-app-text'}`}>{l.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 p-3 bg-slate-50 border-b overflow-x-auto no-scrollbar shrink-0">
        {(['situation', 'vocab', 'grammar'] as const).map((tab) => (
          <button key={tab} onClick={() => logic.setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${logic.activeTab === tab ? 'bg-app-primary text-white shadow-lg' : 'bg-white text-slate-400 border'}`}>
            {tab === 'situation' ? 'Bài học' : tab === 'vocab' ? 'Từ vựng' : 'Cấu trúc'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-app-bg/50">
        <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>}>
          {logic.activeTab === 'situation' && <LessonSituationView lesson={lesson} onWordLookup={logic.setSelectedLookupWord} onOpenRecord={logic.openRecordModal} />}
          {logic.activeTab === 'vocab' && <LessonVocabView lesson={lesson} savedVocabIds={logic.savedVocabIds} onSaveVocab={logic.handleSaveVocab} />}
          {logic.activeTab === 'grammar' && <LessonGrammarView lesson={lesson} onWordLookup={logic.setSelectedLookupWord} />}
        </Suspense>
      </div>

      {logic.recordModalOpen && logic.phraseToRecord && (
        <div className="fixed inset-0 z-[100] bg-app-text/60 backdrop-blur-md flex items-end justify-center" onClick={() => logic.setRecordModalOpen(false)}>
           <div className="bg-white rounded-t-[48px] w-full max-w-md shadow-2xl animate-slide-up-modal flex flex-col h-[85dvh]" onClick={(e) => e.stopPropagation()}>
              <div className="pt-6 px-10 border-b bg-white rounded-t-[48px] sticky top-0">
                <div className="flex justify-center mb-6"><div className="w-16 h-1.5 bg-slate-100 rounded-full" /></div>
                <div className="flex justify-between items-center pb-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pronunciation Lab</span>
                  <button onClick={() => logic.setRecordModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full"><X size={24} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-8 pb-24">
                <NailSpeakScore targetText={logic.phraseToRecord.text} bestScore={logic.getBestScore(logic.phraseToRecord.text)} onScoreUpdate={(score) => logic.handleScoreUpdate(logic.phraseToRecord.text, score)} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
