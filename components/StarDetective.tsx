
import { FC, Suspense, lazy } from 'react';
import { useDetectiveLogic } from './detective/useDetectiveLogic';
import { playAudio } from '../utils/audioUtils';
import { Volume2, ArrowRight, Star } from 'lucide-react';

const DetectiveResultView = lazy(() => import('./detective/DetectiveResultView'));
const DetectiveChoiceGrid = lazy(() => import('./detective/DetectiveChoiceGrid'));

const SunnyMascot: FC<{ message: string, mood?: 'happy' | 'sad' | 'thinking' }> = ({ message, mood = 'happy' }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-3xl soft-shadow animate-fade-in mb-4 border border-white/50">
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-inner ${mood === 'happy' ? 'bg-amber-100' : 'bg-red-50'}`}>
      {mood === 'happy' ? '☀️' : mood === 'sad' ? '☁️' : '🤔'}
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-bold leading-tight text-app-text">{message}</p>
    </div>
  </div>
);

interface StarDetectiveProps {
  onBack: () => void;
}

const StarDetective: FC<StarDetectiveProps> = ({ onBack }) => {
  const {
    rounds, currentRoundIdx, selectedIds, gameState, roundScore,
    totalScore, maxScore, feedback, basket, countdown, loadingProgress,
    toggleChoice, handleConfirm, nextRound
  } = useDetectiveLogic(onBack);

  if (gameState === 'loading') return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-app-bg animate-fade-in">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <div className="w-full max-w-[200px] h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Thám tử đang chuẩn bị...</p>
    </div>
  );

  if (gameState === 'finished') return (
    <Suspense fallback={<div className="h-full flex items-center justify-center font-black">Tính điểm...</div>}>
      <DetectiveResultView totalScore={totalScore} maxScore={maxScore} onBack={onBack} />
    </Suspense>
  );

  const currentRound = rounds[currentRoundIdx];

  return (
    <div className="h-full flex flex-col bg-app-bg p-5 overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
           {rounds.map((_, i) => (
             <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= currentRoundIdx ? 'bg-app-primary' : 'bg-slate-200'}`} />
           ))}
        </div>
        <div className="text-sm font-black text-amber-500 flex items-center gap-1 animate-bounce-in">
          <Star size={16} fill="currentColor" /> {totalScore}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => currentRound && playAudio(currentRound.audioText, 'normal')} 
          className="w-16 h-16 bg-app-primary text-white rounded-3xl flex items-center justify-center shadow-xl active:scale-90 transition-all border-4 border-white relative"
        >
          <Volume2 size={28} />
          {countdown !== null && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center font-black text-xs border-2 border-white animate-bounce-in">
              {countdown}
            </div>
          )}
        </button>
        <div className="flex-1">
          {gameState === 'playing' ? (
            <button 
              onClick={handleConfirm} 
              disabled={selectedIds.length === 0} 
              className={`w-full h-16 rounded-3xl font-black shadow-lg flex items-center justify-center transition-all uppercase text-xs tracking-widest ${selectedIds.length > 0 ? 'bg-app-accent text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
            >
              XÁC NHẬN
            </button>
          ) : (
            <button 
              onClick={nextRound} 
              className="w-full h-16 bg-green-500 text-white rounded-3xl font-black shadow-lg flex items-center justify-center active:scale-95 transition-all uppercase text-xs tracking-widest animate-bounce-in"
            >
              TIẾP THEO <ArrowRight size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>

      <SunnyMascot 
        message={feedback} 
        mood={gameState === 'checking' ? (roundScore && roundScore > 30 ? 'happy' : 'sad') : 'thinking'} 
      />

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-8 h-8 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <DetectiveChoiceGrid 
            basket={basket}
            selectedIds={selectedIds}
            correctIds={currentRound?.correctIds || []}
            gameState={gameState as 'playing' | 'checking'}
            onToggle={toggleChoice}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default StarDetective;
