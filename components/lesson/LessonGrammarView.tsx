
import React from 'react';
import { Lesson } from '../../types';
import InteractiveText from '../InteractiveText';
import { playAudio } from '../../utils/audioUtils';
import { Volume2 } from 'lucide-react';

interface LessonGrammarViewProps {
  lesson: Lesson;
  onWordLookup: (word: string) => void;
}

const LessonGrammarView: React.FC<LessonGrammarViewProps> = ({ lesson, onWordLookup }) => {
  return (
    <div className="p-6 space-y-6 pb-32 animate-fade-in">
      {lesson.grammar_points?.map(gp => (
        <div key={gp.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-app-text p-6 border-b border-slate-800"><h4 className="font-black text-app-secondary text-xs uppercase tracking-[0.2em]">{gp.title}</h4></div>
          <div className="p-8 space-y-6">
            <p className="text-sm text-slate-500 leading-relaxed font-bold">{gp.description}</p>
            <div className="space-y-4">
              {gp.examples.map((ex, i) => (
                <div key={i} className="flex justify-between items-center bg-app-primary/5 p-6 rounded-[28px] border border-app-primary/10">
                  <div className="pr-4 flex-1">
                    <InteractiveText text={ex.english} onWordClick={onWordLookup} className="text-base font-black text-app-text mb-1" />
                    <p className="text-[11px] text-slate-400 italic font-bold">{ex.vietnamese}</p>
                  </div>
                  <button onClick={() => playAudio(ex.english)} className="w-10 h-10 flex items-center justify-center bg-white text-app-primary rounded-xl shadow-sm active:scale-90 transition-all"><Volume2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonGrammarView;
