
import React from 'react';
import { Lesson } from '../../types';
import InteractiveText from '../InteractiveText';
import { Flag, Target, Volume2, Mic } from 'lucide-react';
import { playAudio } from '../../utils/audioUtils';

interface LessonSituationViewProps {
  lesson: Lesson;
  onWordLookup: (word: string) => void;
  onOpenRecord: (text: string, id: string) => void;
}

const LessonSituationView: React.FC<LessonSituationViewProps> = ({ lesson, onWordLookup, onOpenRecord }) => {
  return (
    <div className="p-5 space-y-10 pb-32 animate-fade-in">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
         <div className="header-gradient px-8 py-5">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Flag size={14} /> BỐI CẢNH</h3>
         </div>
         <div className="p-8 space-y-6">
            <InteractiveText text={lesson.context?.background || ""} onWordClick={onWordLookup} className="text-base text-app-text leading-relaxed font-bold italic" />
            <div className="bg-app-primary/5 p-6 rounded-[32px] border border-app-primary/10">
               <h4 className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Target size={14} /> MỤC TIÊU</h4>
               <InteractiveText text={lesson.context?.goal || ""} onWordClick={onWordLookup} className="text-sm text-app-text font-bold leading-relaxed" />
            </div>
         </div>
      </div>

      <div className="space-y-16">
        {lesson.steps?.map((step, sIdx) => (
          <div key={step.id} className="relative">
            <div className="flex gap-6 mb-8 items-start">
              <div className="w-12 h-12 rounded-[20px] bg-app-primary text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg border-4 border-white">{sIdx + 1}</div>
              <div className="flex-1 pt-1">
                <h4 className="text-lg font-black text-app-text leading-tight mb-2">{step.title}</h4>
                <div className="inline-block bg-white border border-app-primary/10 px-4 py-2 rounded-2xl">
                  <p className="text-[11px] text-slate-500 font-black italic">{step.purpose}</p>
                </div>
              </div>
            </div>
            <div className="space-y-10 pl-4 border-l-2 border-dashed border-slate-200 ml-6">
              {step.lines.map((line) => {
                const isTech = line.speaker === 'Tech' || line.speaker === 'Student';
                return (
                  <div key={line.id} className={`flex flex-col w-full ${isTech ? 'items-end' : 'items-start'}`}>
                    <div className={`flex gap-4 max-w-[95%] ${isTech ? 'flex-row-reverse self-end' : 'self-start'}`}>
                      <div className={`rounded-[32px] p-6 border shadow-sm transition-all relative ${isTech ? 'bg-white border-app-primary/20 rounded-tr-none' : 'bg-app-text border-slate-800 text-white rounded-bl-none'}`}>
                        <InteractiveText 
                          text={line.text} 
                          onWordClick={onWordLookup} 
                          isUser={!isTech}
                          className={`font-black text-base leading-snug ${isTech ? 'text-app-text' : 'text-white'}`} 
                        />
                        <p className="text-[12px] font-bold italic mt-3 text-slate-400">{line.translation}</p>
                        <div className={`flex items-center gap-4 mt-5 pt-4 border-t ${isTech ? 'border-slate-50' : 'border-white/10'}`}>
                          <button onClick={() => playAudio(line.text)} className={`p-2 rounded-xl ${isTech ? 'bg-app-primary/10 text-app-primary' : 'bg-white/10 text-white/60'}`}><Volume2 size={18} /></button>
                          {isTech && <button onClick={() => onOpenRecord(line.text, line.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-app-primary text-white shadow-lg shadow-app-primary/20"><Mic size={14} /> LUYỆN NÓI</button>}
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
  );
};

export default LessonSituationView;
