
import React from 'react';
import LessonCard from '../components/LessonCard';
import { Lesson, LessonStatus, UserProgress } from '../types';
import { Sparkles, Star, Zap, LayoutGrid, Trophy, PlayCircle, Target } from 'lucide-react';

interface DashboardProps {
  lessons: Lesson[];
  onSelectLesson: (id: string) => void;
  onSelectPractice?: () => void;
  onViewRoadmap?: () => void;
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ lessons, onSelectLesson, onSelectPractice, onViewRoadmap, progress }) => {
  const getStatus = (lessonId: string): LessonStatus => {
    if (progress.completedLessons.includes(lessonId)) return LessonStatus.COMPLETED;
    return LessonStatus.UNLOCKED;
  };

  const nextLesson = lessons.find(l => !progress.completedLessons.includes(l.id)) || lessons[0];

  const scores = Object.values(progress.bestScores) as number[];
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc: number, val: number) => acc + val, 0) / scores.length) 
    : 0;

  return (
    <div className="pb-32">
      <div className="p-5">
        <div className="bg-gradient-to-br from-app-primary to-app-secondary rounded-4xl p-8 text-white soft-shadow relative overflow-hidden border border-white/10">
          <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 scale-150">
            <Zap size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] glass-card px-4 py-1.5 rounded-full border border-white/20">
                Level: Apprentice
              </span>
            </div>
            
            <h2 className="text-3xl font-black mb-6 leading-[1.1] tracking-tight">
              Chào mừng trở lại,<br/>Star Artist!
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-black/10 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                  style={{ width: `${(progress.completedLessons.length / Math.max(lessons.length, 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-white/80">
                {Math.round((progress.completedLessons.length / Math.max(lessons.length, 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[32px] soft-shadow flex flex-col items-center text-center border border-slate-50">
          <div className="w-10 h-10 bg-app-accent/10 text-app-accent rounded-2xl flex items-center justify-center mb-2">
            <Star size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black text-app-text leading-none">{Object.keys(progress.bestScores).length}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Kỹ năng đạt</span>
        </div>
        <div className="bg-white p-5 rounded-[32px] soft-shadow flex flex-col items-center text-center border border-slate-50">
          <div className="w-10 h-10 bg-app-primary/10 text-app-primary rounded-2xl flex items-center justify-center mb-2">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black text-app-text leading-none">{averageScore}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Trình độ TB</span>
        </div>
      </div>

      <div className="px-5 mb-8">
        <button 
          onClick={onSelectPractice}
          className="w-full bg-app-accent/5 p-6 rounded-4xl soft-shadow border border-app-accent/20 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
            <Trophy size={120} />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-app-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-app-accent/20">
              <Trophy size={28} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-app-accent uppercase tracking-[0.2em] mb-1">Interactive Hub</p>
              <h4 className="text-base font-black text-app-text">Thử thách mỗi ngày</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Luyện Nghe • Nói • Viết</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-app-accent flex items-center justify-center group-hover:translate-x-1 transition-transform border border-app-accent/10 shadow-sm">
            <PlayCircle size={20} />
          </div>
        </button>
      </div>

      {nextLesson && (
        <div className="px-5 mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Target size={14} /> BÀI HỌC TIẾP THEO
            </h3>
            <button 
              onClick={onViewRoadmap}
              className="text-[10px] font-black text-app-primary uppercase tracking-widest hover:underline"
            >
              Xem lộ trình
            </button>
          </div>
          <LessonCard 
            lesson={nextLesson}
            status={getStatus(nextLesson.id)}
            onClick={() => onSelectLesson(nextLesson.id)}
          />
        </div>
      )}

      <div className="px-5">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <LayoutGrid size={14} /> CHUYÊN NGÀNH KHÁC
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          <div className="flex flex-col items-center gap-3 min-w-[80px]">
            <div className="w-16 h-16 rounded-[24px] bg-app-primary soft-shadow flex items-center justify-center text-white border-4 border-white">
              <span className="text-2xl">💅</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-app-primary">Nail Spa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
