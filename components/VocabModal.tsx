
import React, { useState, useEffect } from 'react';
import { Vocabulary } from '../types';
import { fetchWordDetail } from '../services/ai/dictionaryService';
import { playAudio } from '../utils/audioUtils';
import { X, Volume2, Plus, Check, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { auth } from '../services/firebase';
import { saveToLibraryVocab } from '../services/userService';

interface VocabModalProps {
  word: string;
  onClose: () => void;
  existingVocab?: Vocabulary[];
}

const VocabModal: React.FC<VocabModalProps> = ({ word, onClose, existingVocab }) => {
  const [loading, setLoading] = useState(true);
  const [vocabData, setVocabData] = useState<Partial<Vocabulary> | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      const localMatch = existingVocab?.find(v => v.word.toLowerCase() === word.toLowerCase());
      if (localMatch) {
        setVocabData(localMatch);
        setLoading(false);
      } else {
        const aiData = await fetchWordDetail(word);
        setVocabData(aiData);
        setLoading(false);
      }
    };
    loadDetail();
  }, [word, existingVocab]);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !vocabData) return;
    try {
      await saveToLibraryVocab(uid, vocabData.word!); 
      setIsSaved(true);
    } catch (e) {
      alert("Lỗi khi lưu vào thư viện");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
      <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative overflow-hidden animate-slide-up-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500"><X size={24} /></button>
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={40} className="text-app-primary animate-spin mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">AI đang tra từ điển...</p>
          </div>
        ) : vocabData ? (
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-app-primary/10 text-app-primary rounded-[30px] flex items-center justify-center mb-4 shadow-inner"><BookOpen size={32} /></div>
              <h3 className="text-2xl font-black text-app-text mb-1">{vocabData.word}</h3>
              <span className="text-sm font-black text-slate-300 italic">{vocabData.ipa}</span>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-amber-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nghĩa chuyên ngành</span></div>
                <p className="text-base font-black text-app-primary">{vocabData.translation}</p>
                {vocabData.definition && <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{vocabData.definition}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => playAudio(vocabData.word!)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"><Volume2 size={18} /> Nghe</button>
                <button onClick={handleSave} disabled={isSaved} className={`flex-[1.5] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${isSaved ? 'bg-green-500 text-white' : 'bg-app-primary text-white'}`}>
                  {isSaved ? 'Đã lưu' : 'Lưu lại'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VocabModal;
