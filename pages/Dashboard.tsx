
import React from 'react';
import { LESSONS } from '../constants';
import LessonCard from '../components/LessonCard';
import { LessonStatus, UserProgress } from '../types';
import { Sparkles, Star, ChevronRight, Zap } from 'lucide-react';

interface DashboardProps {
  onSelectLesson: (id: string) => void;
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectLesson, progress }) => {
  const getStatus = (lessonId: string): LessonStatus => {
    if (progress.completedLessons.includes(lessonId)) return LessonStatus.COMPLETED;
    return LessonStatus.UNLOCKED;
  };

  const nextLesson = LESSONS.find(l => !progress.completedLessons.includes(l.id)) || LESSONS[0];

  // Fix: Explicitly type the score values as numbers for reduce
  const scores = Object.values(progress.bestScores) as number[];
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc: number, val: number) => acc + val, 0) / scores.length) 
    : 0;

  return (
    <div className="pb-24">
      {/* Hero Header Card */}
      <div className="p-5">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden border border-white/10">
          <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 scale-150">
            <Zap size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                Technical English Master
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-200">
              Làm chủ nghề nghiệp, tự tin giao tiếp cùng TechSpeak
            </h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-white/10 h-2.5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-pink-400 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(129,140,248,0.5)]" 
                  style={{ width: `${(progress.completedLessons.length / LESSONS.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-bold text-indigo-300">
                {progress.completedLessons.length}/{LESSONS.length} bài
              </span>
            </div>

            <button 
              onClick={() => onSelectLesson(nextLesson.id)}
              className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-indigo-50"
            >
              Học tiếp: Bài {nextLesson.order} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-5 mb-8">
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-3">
            <Star size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black text-slate-800 leading-none">{Object.keys(progress.bestScores).length}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Từ đã luyện</span>
        </div>
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black text-slate-800 leading-none">
            {averageScore}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Điểm TechSpeak</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
             Lộ trình Nail (Phần 1)
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">Đang học</span>
        </div>
        <div className="space-y-4">
          {LESSONS.map((lesson) => (
            <LessonCard 
              key={lesson.id}
              lesson={lesson}
              status={getStatus(lesson.id)}
              onClick={() => onSelectLesson(lesson.id)}
            />
          ))}
        </div>
        
        {/* Placeholder for future careers */}
        <div className="mt-8 pt-6 border-t border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Các lộ trình sắp ra mắt</p>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
              <div className="min-w-[140px] bg-slate-100 p-4 rounded-3xl opacity-50 grayscale border border-slate-200">
                 <div className="w-10 h-10 bg-white rounded-xl mb-3 flex items-center justify-center text-slate-400">🏗️</div>
                 <p className="text-xs font-bold text-slate-600">Xây dựng</p>
              </div>
              <div className="min-w-[140px] bg-slate-100 p-4 rounded-3xl opacity-50 grayscale border border-slate-200">
                 <div className="w-10 h-10 bg-white rounded-xl mb-3 flex items-center justify-center text-slate-400">🪚</div>
                 <p className="text-xs font-bold text-slate-600">Thợ mộc</p>
              </div>
              <div className="min-w-[140px] bg-slate-100 p-4 rounded-3xl opacity-50 grayscale border border-slate-200">
                 <div className="w-10 h-10 bg-white rounded-xl mb-3 flex items-center justify-center text-slate-400">🔧</div>
                 <p className="text-xs font-bold text-slate-600">Cơ khí</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
