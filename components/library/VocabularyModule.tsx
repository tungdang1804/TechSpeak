
import React, { useMemo, useState } from 'react';
import { Lesson } from '../../types';
import { playAudio } from '../../utils/audioUtils';
import { ChevronDown, Volume2, Sparkles, Box, Search, Globe } from 'lucide-react';
import { useUserProgress } from '../../hooks/useUserProgress';
import { getFilteredVocab, getAllVocabItems } from '../../services/vocabulary/filterService';

interface VocabularyModuleProps {
  lessons: Lesson[];
}

const VocabularyModule: React.FC<VocabularyModuleProps> = ({ lessons }) => {
  const { userProfile } = useUserProgress();
  const [vocabSubTab, setVocabSubTab] = useState<'industry' | 'general' | 'az'>('industry');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 'spec_0': true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sử dụng filterService để tách biệt dữ liệu
  const { specialized, general } = useMemo(() => 
    getFilteredVocab(userProfile?.primaryIndustry || 'nails'), 
  [userProfile?.primaryIndustry]);

  const azList = useMemo(() => {
    const lessonVocab = lessons.flatMap(l => l.vocabularies || []);
    const items = getAllVocabItems(userProfile?.primaryIndustry || 'nails', lessonVocab);
    if (!searchQuery) return items;
    return items.filter(i => 
      (i.text || i.word).toLowerCase().includes(searchQuery.toLowerCase()) || 
      (i.sub || i.translation).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lessons, userProfile?.primaryIndustry, searchQuery]);

  const renderGroup = (group: any, prefix: string, idx: number) => {
    const nodeKey = `${prefix}_${idx}`;
    const isOpen = expandedNodes[nodeKey];
    const isIndustry = group.industry !== 'common' && group.industry !== 'other';

    return (
      <div key={nodeKey} className={`bg-white rounded-[32px] soft-shadow border overflow-hidden mb-4 ${isIndustry ? 'border-app-primary/20' : 'border-slate-100'}`}>
        <button 
          onClick={() => toggleNode(nodeKey)}
          className={`w-full p-5 flex items-center justify-between transition-all ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isIndustry ? 'bg-app-primary/10' : 'bg-slate-100'}`}>
              {group.icon}
            </div>
            <div className="text-left">
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] block mb-1 ${isIndustry ? 'text-app-primary' : 'text-slate-400'}`}>
                {group.industry.toUpperCase()}
              </span>
              <h3 className="text-sm font-black text-app-text">{group.title}</h3>
            </div>
          </div>
          <ChevronDown size={20} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="bg-white border-t border-slate-50 p-4 space-y-6">
            {group.subGroups.map((sub: any, sIdx: number) => (
              <div key={sIdx} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-1 h-3 rounded-full ${isIndustry ? 'bg-app-primary' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {sub.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {sub.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-app-primary/20 transition-all group">
                      <div className="flex-1 pr-4">
                        <p className="text-sm font-black text-app-text group-hover:text-app-primary transition-colors">{item.text}</p>
                        <p className="text-[11px] text-slate-400 font-bold">{item.sub}</p>
                      </div>
                      <button 
                        onClick={() => playAudio(item.text)} 
                        className="w-10 h-10 bg-white text-app-primary rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-all border border-slate-100"
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
    );
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Sub Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 mx-4 mt-2">
        <button 
          onClick={() => setVocabSubTab('industry')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vocabSubTab === 'industry' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}
        >
          <Sparkles size={14} /> Chuyên môn
        </button>
        <button 
          onClick={() => setVocabSubTab('general')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vocabSubTab === 'general' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
        >
          <Globe size={14} /> Kho chung
        </button>
        <button 
          onClick={() => setVocabSubTab('az')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vocabSubTab === 'az' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
        >
          <Box size={14} /> Tra cứu A-Z
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        {vocabSubTab === 'industry' && (
          <div className="animate-fade-in">
            {specialized.map((g, i) => renderGroup(g, 'spec', i))}
          </div>
        )}

        {vocabSubTab === 'general' && (
          <div className="animate-fade-in">
            <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 mb-6">
              <p className="text-[10px] font-bold text-indigo-600 leading-relaxed uppercase tracking-wider">
                🌟 Nơi lưu trữ kiến thức phổ thông và từ vựng từ các ngành nghề khác bạn đã từng xem qua.
              </p>
            </div>
            {general.map((g, i) => renderGroup(g, 'gen', i))}
          </div>
        )}

        {vocabSubTab === 'az' && (
          <div className="animate-fade-in space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Tìm từ vựng bất kỳ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-app-primary/5 transition-all outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {azList.map((v, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[32px] border border-slate-100 soft-shadow flex items-center justify-between group hover:border-app-primary/20 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-black text-app-primary">{v.text || v.word}</h4>
                      {v.ipa && <span className="text-[10px] text-slate-300 italic font-medium">{v.ipa}</span>}
                    </div>
                    <p className="text-xs font-bold text-slate-600 italic">"{v.sub || v.translation}"</p>
                  </div>
                  <button 
                    onClick={() => playAudio(v.text || v.word)} 
                    className="w-12 h-12 bg-slate-50 text-app-primary rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-slate-100 group-hover:bg-app-primary group-hover:text-white shadow-sm"
                  >
                    <Volume2 size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyModule;
