
import React, { useMemo } from 'react';
import { Lesson } from '../../types';
import { UserProfile } from '../../services/userService';
import { playAudio } from '../../utils/audioUtils';
import { Sparkles, Volume2, Bookmark } from 'lucide-react';

interface GrammarModuleProps {
  lessons: Lesson[];
  profile: UserProfile;
}

const GrammarModule: React.FC<GrammarModuleProps> = ({ lessons, profile }) => {
  const allGrammar = useMemo(() => lessons.flatMap(l => l.grammar_points || []), [lessons]);
  
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32 animate-fade-in">
      <div className="space-y-6">
        {allGrammar.map((gp, idx) => (
          <div key={idx} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className={`p-5 border-b flex items-center justify-between ${gp.isCollocation ? 'bg-amber-500 border-amber-600' : 'bg-app-text border-slate-800'}`}>
              <div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 ${gp.isCollocation ? 'text-amber-100' : 'text-app-secondary'}`}>
                  {gp.isCollocation ? 'COLLOCATION' : `PATTERN #${idx + 1}`}
                </span>
                <h4 className="font-black text-white text-sm">{gp.title}</h4>
              </div>
              {gp.isCollocation && <Bookmark size={18} className="text-white opacity-40" />}
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 font-bold leading-relaxed">{gp.description}</p>
              <div className="space-y-3">
                {gp.examples.map((ex, i) => (
                  <div key={i} className={`p-4 rounded-[24px] border flex items-center justify-between ${gp.isCollocation ? 'bg-amber-50 border-amber-100' : 'bg-app-primary/5 border-app-primary/10'}`}>
                    <div className="flex-1 pr-4">
                      <p className={`text-sm font-black mb-1 ${gp.isCollocation ? 'text-amber-900' : 'text-app-text'}`}>{ex.english}</p>
                      <p className="text-[10px] text-slate-400 italic font-bold">{ex.vietnamese}</p>
                    </div>
                    <button 
                      onClick={() => playAudio(ex.english)} 
                      className={`w-9 h-9 rounded-xl shadow-sm flex items-center justify-center bg-white ${gp.isCollocation ? 'text-amber-600' : 'text-app-primary'}`}
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {profile.userGrammar?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-2">
              <Sparkles size={14} className="text-amber-500" /> TỪ THỰC CHIẾN AI
            </h3>
            <div className="space-y-4">
              {profile.userGrammar.map((pg, i) => (
                <div key={i} className="bg-amber-50 rounded-[32px] p-6 border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase mb-3">Lỗi cũ: "{pg.original}"</p>
                  <div className="bg-white p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                     <div className="flex-1 pr-4">
                        <p className="text-sm font-black text-green-700">"{pg.corrected}"</p>
                        <p className="text-[10px] text-slate-400 mt-1 italic">{pg.explanation}</p>
                     </div>
                     <button onClick={() => playAudio(pg.corrected)} className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Volume2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarModule;
