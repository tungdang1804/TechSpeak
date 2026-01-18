import React, { useState, useMemo } from 'react';
import { LESSONS, IPA_SOUNDS } from '../constants';
import { UserProgress, IPASound } from '../types';
import { ArrowLeft, Mic, Volume2, Sparkles, Book, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import NailSpeakScore from './NailSpeakScore';
import { playAudio } from '../utils/audioUtils';

interface NailSpeakHubProps {
  onBack: () => void;
  progress: UserProgress;
  onScoreUpdate: (text: string, score: number) => void;
}

type Tab = 'ipa' | 'vocab' | 'grammar';

interface PracticeItem {
  id: string;
  text: string;
  sub: string;
  tag?: string;
  ipa?: string;
}

interface PracticeGroup {
  lessonTitle: string;
  items: PracticeItem[];
}

const HighlightIPA: React.FC<{ text: string; target: string }> = ({ text, target }) => {
  if (!text.includes(target)) return <span className="font-mono text-gray-500">{text}</span>;
  
  const parts = text.split(target);
  return (
    <span className="font-mono text-gray-500">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-pink-600 font-bold bg-pink-100 px-0.5 rounded">{target}</span>}
        </React.Fragment>
      ))}
    </span>
  );
};

const NailSpeakHub: React.FC<NailSpeakHubProps> = ({ onBack, progress, onScoreUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ipa');
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [selectedIPA, setSelectedIPA] = useState<IPASound>(IPA_SOUNDS[0]);
  
  // State for Accordion (Droplist) - default open first lesson (index 0)
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number | null>(0);

  // Use ALL lessons instead of filtering by unlocked status
  const allLessons = LESSONS;

  // Group Vocab by Lesson
  const vocabByLesson = useMemo<PracticeGroup[]>(() => {
    return allLessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.vocabularies.map(v => ({ 
        id: v.id, 
        text: v.word, 
        sub: v.translation,
        ipa: v.ipa 
      }))
    })).filter(group => group.items.length > 0);
  }, [allLessons]);

  // Group Grammar Examples by Lesson
  const grammarByLesson = useMemo<PracticeGroup[]>(() => {
    return allLessons.map(lesson => ({
      lessonTitle: lesson.title,
      items: lesson.grammarPoints.flatMap(gp => 
        gp.examples.map((ex, idx) => ({ 
          id: `${gp.id}_${idx}`, 
          text: ex.english, 
          sub: ex.vietnamese,
          tag: gp.title
        }))
      )
    })).filter(group => group.items.length > 0);
  }, [allLessons]);

  React.useEffect(() => {
    setSelectedItem(null);
    setExpandedGroupIndex(0); // Reset to open first lesson when tab changes
  }, [activeTab]);

  const toggleGroup = (index: number) => {
    setExpandedGroupIndex(prev => (prev === index ? null : index));
  };

  const renderIPADetails = () => {
    if (!selectedIPA) return null;
    return (
      <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-6 mb-6 animate-fade-in sticky top-0 z-10">
        <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
          <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-bold font-serif text-pink-600">{selectedIPA.symbol}</h3>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">
                {selectedIPA.name || selectedIPA.type}
              </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            <span className="font-bold mr-1">👄 Cách đọc:</span>
            {selectedIPA.description}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
           <p className="text-xs font-bold text-gray-400 uppercase mb-2">Ví dụ ngành Nail:</p>
           <div className="grid grid-cols-1 gap-2">
              {selectedIPA.examples.map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-pink-300" onClick={() => playAudio(ex.word)}>
                   <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-lg">{ex.word}</span>
                      <span className="text-xs text-gray-500 italic">{ex.meaning}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <HighlightIPA text={ex.ipa} target={selectedIPA.symbol} />
                      <div className="bg-pink-100 p-2 rounded-full text-pink-500">
                        <Volume2 size={18} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const renderIPA = () => (
    <div className="p-4 pb-20">
      {renderIPADetails()}
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl mb-6 text-center border border-indigo-100">
        <p className="text-xs text-indigo-700 font-medium">Chọn một ký tự bên dưới để xem chi tiết</p>
      </div>
      
      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span className="w-2 h-6 bg-pink-500 rounded-full"></span> Nguyên âm đơn</h4>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {IPA_SOUNDS.filter(s => s.type === 'vowel').map((s) => (
          <button 
            key={s.symbol}
            onClick={() => {
                setSelectedIPA(s);
                document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                selectedIPA.symbol === s.symbol 
                ? 'bg-pink-600 text-white border-pink-600 shadow-md scale-105' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-pink-300'
            }`}
          >
            <span className="text-xl font-bold font-serif">{s.symbol}</span>
          </button>
        ))}
      </div>

      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span className="w-2 h-6 bg-purple-500 rounded-full"></span> Nguyên âm đôi</h4>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {IPA_SOUNDS.filter(s => s.type === 'diphthong').map((s) => (
          <button 
            key={s.symbol}
            onClick={() => {
                setSelectedIPA(s);
                document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                selectedIPA.symbol === s.symbol 
                ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className="text-lg font-bold font-serif">{s.symbol}</span>
          </button>
        ))}
      </div>

      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span className="w-2 h-6 bg-blue-500 rounded-full"></span> Phụ âm</h4>
      <div className="grid grid-cols-5 gap-2">
        {IPA_SOUNDS.filter(s => s.type === 'consonant').map((s) => (
          <button 
            key={s.symbol}
            onClick={() => {
                setSelectedIPA(s);
                document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all ${
                selectedIPA.symbol === s.symbol 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="text-lg font-bold font-serif">{s.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPracticeList = (groups: PracticeGroup[], type: 'Từ vựng' | 'Ngữ pháp') => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        
        {/* Lesson Groups (Accordions) */}
        <div className="space-y-3">
          {groups.map((group, groupIdx) => {
            const isOpen = expandedGroupIndex === groupIdx;
            return (
              <div key={groupIdx} className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => toggleGroup(groupIdx)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-pink-50/50' : 'bg-white'}`}
                >
                  <div>
                    <span className="text-xs font-bold text-pink-500 uppercase tracking-widest block mb-1">
                      Bài {groupIdx + 1}
                    </span>
                    <h3 className="font-bold text-gray-800">{group.lessonTitle}</h3>
                  </div>
                  <div className={`text-pink-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-3 bg-gray-50/30 border-t border-pink-50 grid grid-cols-2 gap-2 animate-fade-in">
                    {group.items.map(item => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`relative p-3 rounded-xl border text-left transition-all ${
                            isSelected 
                              ? 'bg-white border-pink-500 ring-2 ring-pink-100 shadow-md z-10' 
                              : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 shadow-sm'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-pink-500">
                              <CheckCircle size={14} />
                            </div>
                          )}
                          <p className={`font-bold text-sm mb-1 line-clamp-2 ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                            {item.text}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Item Practice Area - Appears at bottom of list when selected */}
        {selectedItem && (
          <div className="mt-6 w-full animate-fade-in-up pb-10">
             <div className="flex items-center gap-2 mb-2 px-2">
                <Sparkles size={16} className="text-yellow-500" />
                <span className="text-sm font-bold text-gray-700">Khu vực luyện tập</span>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
                
                {selectedItem.tag && (
                  <span className="inline-block mb-3 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {selectedItem.tag}
                  </span>
                )}
                
                {selectedItem.ipa && (
                   <div className="mb-3">
                      <span className="font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-lg text-lg tracking-wide border border-gray-200">
                          {selectedItem.ipa}
                      </span>
                   </div>
                )}

                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Nghĩa tiếng Việt</p>
                <p className="text-lg text-pink-600 font-bold italic mb-6">"{selectedItem.sub}"</p>
                
                <button 
                  onClick={() => playAudio(selectedItem.text)}
                  className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium mb-6 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700 transition"
                >
                  <Volume2 size={20} />
                  <span>Nghe mẫu</span>
                </button>

                <NailSpeakScore 
                  targetText={selectedItem.text}
                  bestScore={progress.bestScores[selectedItem.text] || 0}
                  onScoreUpdate={(s) => onScoreUpdate(selectedItem.text, s)}
                />
             </div>
          </div>
        )}
        
        {!selectedItem && (
            <div className="text-center py-10 opacity-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mic size={24} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">Chọn một từ hoặc câu ở trên để luyện tập</p>
            </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm pt-4 pb-2 px-4 z-20 shrink-0 border-b border-pink-50">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
            <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
            NailSpeak Score
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button 
            onClick={() => setActiveTab('ipa')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'ipa' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Bảng IPA
          </button>
          <button 
             onClick={() => setActiveTab('vocab')}
             className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'vocab' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Từ vựng
          </button>
          <button 
             onClick={() => setActiveTab('grammar')}
             className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'grammar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Ngữ pháp
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'ipa' && <div className="h-full overflow-y-auto custom-scrollbar">{renderIPA()}</div>}
        {activeTab === 'vocab' && renderPracticeList(vocabByLesson, 'Từ vựng')}
        {activeTab === 'grammar' && renderPracticeList(grammarByLesson, 'Ngữ pháp')}
      </div>
    </div>
  );
};

export default NailSpeakHub;