
import React from 'react';
import { Lesson } from '../../types';
import { playAudio } from '../../utils/audioUtils';
import { Volume2 } from 'lucide-react';

interface LessonVocabViewProps {
  lesson: Lesson;
  savedVocabIds: string[];
  onSaveVocab: (id: string) => void;
}

const LessonVocabView: React.FC<LessonVocabViewProps> = ({ lesson }) => {
  return (
    <div className="p-6 grid grid-cols-1 gap-4 pb-32 animate-fade-in">
      {lesson.vocabularies?.map((v) => (
        <div key={v.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group relative overflow-hidden">
          <div className="flex-1 pr-4">
            <h4 className="font-black text-app-primary text-lg mb-1">{v.word}</h4>
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">{v.ipa}</span>
            <p className="text-sm font-black text-app-text mt-2">{v.translation}</p>
          </div>
          <button 
            onClick={() => playAudio(v.word)} 
            className="w-14 h-14 bg-app-primary/5 text-app-primary rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-sm"
          >
            <Volume2 size={26} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LessonVocabView;
