
import React, { useState, useMemo } from 'react';
import { IPA_SOUNDS } from '../../constants';
import { IPASound } from '../../types';
import { playAudio } from '../../utils/audioUtils';
import { Volume2, X, Info } from 'lucide-react';

const IPAModule: React.FC = () => {
  const [selectedIPASound, setSelectedIPASound] = useState<IPASound | null>(null);

  const vowels = useMemo(() => IPA_SOUNDS.filter(s => s.type === 'vowel'), []);
  const diphthongs = useMemo(() => IPA_SOUNDS.filter(s => s.type === 'diphthong'), []);
  const consonants = useMemo(() => IPA_SOUNDS.filter(s => s.type === 'consonant'), []);

  // Added key property to the type definition to avoid TS error during mapping in the JSX return
  const IPACell = ({ sound }: { sound: IPASound, key?: React.Key }) => (
    <button 
      onClick={() => setSelectedIPASound(sound)}
      className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 group relative overflow-hidden ${selectedIPASound?.symbol === sound.symbol ? 'bg-app-primary text-white border-transparent shadow-lg' : 'bg-white text-app-text border-slate-100 shadow-sm'}`}
    >
      <span className="text-xl font-black italic">/{sound.symbol}/</span>
      <span className={`text-[8px] font-bold uppercase opacity-60 mt-1 ${selectedIPASound?.symbol === sound.symbol ? 'text-white/80' : 'text-slate-400'}`}>
        {sound.examples[0].word}
      </span>
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 animate-fade-in pt-2">
      <div className="mb-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-teal-400 rounded-full"></div> Nguyên âm đơn
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {vowels.map((s, i) => <IPACell key={i} sound={s} />)}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-indigo-400 rounded-full"></div> Nguyên âm đôi
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {diphthongs.map((s, i) => <IPACell key={i} sound={s} />)}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-rose-400 rounded-full"></div> Phụ âm
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {consonants.map((s, i) => <IPACell key={i} sound={s} />)}
        </div>
      </div>

      {selectedIPASound && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedIPASound(null)}></div>
          <div className="bg-white w-full max-w-[340px] rounded-[32px] shadow-2xl relative animate-slide-up-modal flex flex-col max-h-[85dvh] overflow-hidden border border-slate-100">
            
            <div className="px-6 pt-5 pb-2 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-app-primary/10 text-app-primary rounded-lg flex items-center justify-center">
                  <Info size={14} />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Phòng Lab Phát Âm</h3>
              </div>
              <button onClick={() => setSelectedIPASound(null)} className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full active:scale-90 transition-all">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
              <div className="flex flex-col items-center mb-5 pt-2">
                <div className="w-16 h-16 bg-app-primary text-white rounded-[20px] flex items-center justify-center text-3xl font-black italic mb-3 shadow-lg shadow-app-primary/20">
                  /{selectedIPASound.symbol}/
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-black text-app-text mb-1">{selectedIPASound.name || 'Cách phát âm'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-2">{selectedIPASound.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-1">Ví dụ thực tế</p>
                {selectedIPASound.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div className="text-left">
                      <p className="text-xs font-black text-app-text">{ex.word}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{ex.ipa} • {ex.meaning}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); playAudio(ex.word); }} 
                      className="w-8 h-8 bg-white text-app-primary rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-all border border-slate-100"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 bg-white border-t border-slate-50 shrink-0">
              <button 
                onClick={() => playAudio(selectedIPASound.symbol, 'phonetic')}
                className="w-full py-4 bg-app-primary text-white rounded-2xl font-black shadow-lg shadow-app-primary/10 flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
              >
                <Volume2 size={18} fill="currentColor" /> NGHE ÂM TIẾT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPAModule;
