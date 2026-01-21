
import React, { useMemo, useState } from 'react';
import { SPECIALIZED_VOCAB } from '../../data/specialVocab';
import { Lesson } from '../../types';
import { playAudio } from '../../utils/audioUtils';
import { ChevronDown, ChevronRight, Volume2 } from 'lucide-react';

interface VocabularyModuleProps {
  lessons: Lesson[];
}

const VocabularyModule: React.FC<VocabularyModuleProps> = ({ lessons }) => {
  const [vocabSubTab, setVocabSubTab] = useState<'industry' | 'roadmap'>('industry');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 'group_0': true });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const roadmapVocab = useMemo(() => {
    const all = lessons.flatMap(l => l.vocabularies || []);
    // Loại bỏ từ trùng lặp
    const unique = Array.from(new Map(all.map(item => [item.word, item])).values());
    return unique.sort((a, b) => a.word.localeCompare(b.word));
  }, [lessons]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 mx-4 mt-2">
        <button 
          onClick={() => setVocabSubTab('industry')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vocabSubTab === 'industry' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
        >
          Chuyên ngành
        </button>
        <button 
          onClick={() => setVocabSubTab('roadmap')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vocabSubTab === 'roadmap' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
        >
          Lộ trình A-Z
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        {vocabSubTab === 'industry' ? (
          <div className="space-y-4">
            {SPECIALIZED_VOCAB.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-[32px] soft-shadow border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => toggleNode(`group_${gIdx}`)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{group.icon}</div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-app-text">{group.title}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        {group.subGroups.reduce((acc, curr) => acc + curr.items.length, 0)} từ vựng
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-slate-300 transition-transform ${expandedNodes[`group_${gIdx}`] ? 'rotate-180' : ''}`} />
                </button>

                {expandedNodes[`group_${gIdx}`] && (
                  <div className="bg-slate-50/50 border-t border-slate-50 p-4 space-y-4">
                    {group.subGroups.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        {/* Chỉ hiển thị nhãn phụ nếu có nhiều hơn 1 sub-group hoặc tên sub-group có ý nghĩa phân loại */}
                        {group.subGroups.length > 1 && (
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                            {sub.name}
                          </span>
                        )}
                        <div className="grid grid-cols-1 gap-2">
                          {sub.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group shadow-sm">
                              <div>
                                <p className="text-sm font-black text-app-text">{item.text}</p>
                                <p className="text-[11px] text-slate-400 font-bold">{item.sub}</p>
                              </div>
                              <button 
                                onClick={() => playAudio(item.text)} 
                                className="w-10 h-10 bg-app-primary/5 rounded-xl flex items-center justify-center text-app-primary shadow-sm active:scale-90 transition-all"
                              >
                                <Volume2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {roadmapVocab.map((v, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[32px] border border-slate-100 soft-shadow flex items-center justify-between animate-fade-in">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-black text-app-primary">{v.word}</h4>
                    <span className="text-[10px] text-slate-300 italic font-medium">{v.ipa}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 italic">"{v.translation}"</p>
                </div>
                <button 
                  onClick={() => playAudio(v.word)} 
                  className="w-12 h-12 bg-app-primary/5 text-app-primary rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-sm"
                >
                  <Volume2 size={22} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyModule;
