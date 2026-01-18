
import React from 'react';
import { Lesson, LessonStatus } from '../types';
import { Lock, CheckCircle, ChevronRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, status, onClick }) => {
  const isLocked = status === LessonStatus.LOCKED;
  const isCompleted = status === LessonStatus.COMPLETED;

  return (
    <button 
      onClick={!isLocked ? onClick : undefined}
      className={`relative flex flex-row items-center w-full p-5 rounded-[28px] border transition-all duration-300 text-left group
        ${isLocked 
          ? 'bg-slate-100 border-slate-200 opacity-60' 
          : isCompleted 
            ? 'bg-white border-green-100 shadow-sm hover:shadow-md' 
            : 'bg-white border-slate-100 shadow-sm hover:shadow-md active:scale-[0.97]'
        }`}
    >
      {/* Lesson Index Circle */}
      <div className={`w-14 h-14 shrink-0 rounded-[22px] flex items-center justify-center mr-5 transition-all
         ${isLocked ? 'bg-slate-200 text-slate-400' 
           : isCompleted ? 'bg-green-50 text-green-500' 
           : 'bg-pink-50 text-pink-500 group-hover:scale-110'}`}>
        {isCompleted ? <CheckCircle size={26} strokeWidth={2.5} /> : isLocked ? <Lock size={24} /> : <span className="text-xl font-black">{lesson.order}</span>}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <h3 className={`font-extrabold text-base mb-1 truncate ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
          {lesson.title}
        </h3>
        <p className="text-[11px] text-slate-400 font-medium leading-tight line-clamp-2">
          {lesson.description}
        </p>
      </div>

      {/* Navigation Arrow */}
      {!isLocked && (
        <div className="text-slate-300 transition-transform group-hover:translate-x-1">
          <ChevronRight size={20} strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

export default LessonCard;
