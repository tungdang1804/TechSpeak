
import { useState, useEffect, useRef, FC } from 'react';
import { COMMON_CHOICES } from '../data/gameData';
import { GameRound, GameChoice } from '../types';
import { generateGameRounds } from '../services/geminiService';
import { playAudio, stopAllAudio, preloadAudio } from '../utils/audioUtils';
import { Volume2, CheckCircle2, Trophy, ArrowRight, Loader2, Star, RefreshCw } from 'lucide-react';

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
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'checking' | 'finished'>('loading');
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [feedback, setFeedback] = useState("Sẵn sàng thám tử nhé!");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [basket, setBasket] = useState<GameChoice[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const autoPlayTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const lastInitializedRoundRef = useRef<number | null>(null);

  useEffect(() => {
    initGame();
    return () => {
      clearAllTimers();
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && rounds[currentRoundIdx] && lastInitializedRoundRef.current !== currentRoundIdx) {
      lastInitializedRoundRef.current = currentRoundIdx;
      setupBasket();
      startAutoPlaySequence();
    }
    return () => clearAllTimers();
  }, [currentRoundIdx, gameState, rounds]);

  const clearAllTimers = () => {
    if (autoPlayTimerRef.current) window.clearTimeout(autoPlayTimerRef.current);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
    autoPlayTimerRef.current = null;
    countdownIntervalRef.current = null;
  };

  const startAutoPlaySequence = () => {
    clearAllTimers();
    stopAllAudio(); 
    
    setCountdown(5);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev !== null && prev > 1) return prev - 1;
        window.clearInterval(countdownIntervalRef.current!);
        return null;
      });
    }, 1000);

    autoPlayTimerRef.current = window.setTimeout(() => {
      if (rounds[currentRoundIdx] && gameState === 'playing') {
        playAudio(rounds[currentRoundIdx].audioText, 'normal'); // Dùng 'normal' cho câu dài
      }
      setCountdown(null);
    }, 5000);
  };

  const setupBasket = () => {
    const round = rounds[currentRoundIdx];
    if (!round) return;

    const correctOnes = COMMON_CHOICES.filter(c => round.correctIds.includes(c.id));
    const targetCategories = Array.from(new Set(correctOnes.map(c => c.category)));
    const targetSize = 14; 

    const relevantDistractors = COMMON_CHOICES.filter(c => 
      !round.correctIds.includes(c.id) && 
      targetCategories.includes(c.category)
    ).sort(() => Math.random() - 0.5);

    const otherDistractors = COMMON_CHOICES.filter(c => 
      !round.correctIds.includes(c.id) && 
      !targetCategories.includes(c.category)
    ).sort(() => Math.random() - 0.5);

    const result = [
      ...correctOnes, 
      ...relevantDistractors,
      ...otherDistractors
    ].slice(0, targetSize);

    setBasket(result.sort(() => Math.random() - 0.5));
  };

  const initGame = async () => {
    setGameState('loading');
    setLoadingProgress(0);
    
    const interval = window.setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 60) { window.clearInterval(interval); return 60; }
        return prev + 5;
      });
    }, 100);

    const newRounds = await generateGameRounds(COMMON_CHOICES);
    
    if (newRounds.length > 0) {
      setFeedback("Chuẩn bị thính giác...");
      // PRE-LOAD ALL 5 ROUNDS BEFORE STARTING
      const preloadPromises = newRounds.map(r => preloadAudio(r.audioText, 'normal'));
      await Promise.all(preloadPromises);

      setLoadingProgress(100);
      setRounds(newRounds);
      setMaxScore(newRounds.length * 50); 
      setTimeout(() => setGameState('playing'), 500);
    } else {
      onBack();
    }
    window.clearInterval(interval);
  };

  const handleToggleChoice = (id: string) => {
    if (gameState !== 'playing') return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const round = rounds[currentRoundIdx];
    if (!round) return;
    clearAllTimers();
    setCountdown(null);
    stopAllAudio(); 

    const correctCount = selectedIds.filter(id => round.correctIds.includes(id)).length;
    const wrongCount = selectedIds.filter(id => !round.correctIds.includes(id)).length;
    const missedCount = round.correctIds.filter(id => !selectedIds.includes(id)).length;

    let points = (correctCount * 20) - (wrongCount * 10) - (missedCount * 5);
    if (wrongCount === 0 && missedCount === 0) points += 10; 
    if (points < 0) points = 0;

    setRoundScore(points);
    setTotalScore(prev => prev + points);
    setGameState('checking');

    if (wrongCount === 0 && missedCount === 0) {
      setFeedback("Tuyệt đỉnh! Bạn nghe không sót một chữ nào! 🌟");
    } else {
      const correctLabels = round.correctIds.map(id => COMMON_CHOICES.find(c => c.id === id)?.label || id).join(', ');
      setFeedback(`Khách cần: ${correctLabels}.`);
    }
  };

  const nextRound = () => {
    if (currentRoundIdx < rounds.length - 1) {
      stopAllAudio();
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedIds([]);
      setGameState('playing');
      setRoundScore(null);
      setFeedback("Sẵn sàng cho thám tử nhé!");
    } else {
      setGameState('finished');
    }
  };

  const handleRespeak = () => {
    clearAllTimers();
    setCountdown(null);
    if (rounds[currentRoundIdx]) {
      playAudio(rounds[currentRoundIdx].audioText, 'normal');
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 bg-app-bg">
        <div className="relative mb-8">
           <Loader2 size={60} className="text-app-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-app-primary">
             {loadingProgress}%
           </div>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center animate-pulse">
          {feedback}
        </p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-app-bg animate-fade-in overflow-y-auto no-scrollbar">
        <div className="w-20 h-20 bg-app-accent/10 rounded-3xl flex items-center justify-center mb-6 text-app-accent soft-shadow">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-black text-app-text mb-2">Thám Tử Hoàn Tất!</h2>
        <div className="bg-white p-8 rounded-5xl soft-shadow mb-6 w-full max-w-xs border border-white/50 relative">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Kết quả của bạn</p>
          <p className="text-5xl font-black text-app-primary">{totalScore}<span className="text-lg text-slate-300">/{maxScore}</span></p>
        </div>
        <button onClick={onBack} className="w-full max-w-[240px] py-4 bg-app-primary text-white rounded-2xl font-black shadow-lg mb-4 active:scale-95 transition-all uppercase tracking-widest text-xs">Về Trang Chủ</button>
        <button onClick={() => window.location.reload()} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"><RefreshCw size={14} /> Thử thách mới</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-app-bg p-5 overflow-hidden">
      <div className="shrink-0 mb-4 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Round {currentRoundIdx + 1}/5</span>
              <div className="flex gap-1">
                 {[0,1,2,3,4].map((i) => (
                   <div key={i} className={`h-1 w-3 rounded-full ${i <= currentRoundIdx ? 'bg-app-primary' : 'bg-slate-200'}`} />
                 ))}
              </div>
           </div>
           <div className="text-sm font-black text-app-accent flex items-center gap-1">
              <Star size={14} fill="currentColor" /> {totalScore}
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <button 
              onClick={handleRespeak}
              className="w-14 h-14 bg-app-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all border border-white/20"
            >
              <Volume2 size={24} />
            </button>
            {countdown !== null && (
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                <span className="text-[10px] font-black">{countdown}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            {gameState === 'playing' ? (
              <button 
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md
                  ${selectedIds.length > 0 ? 'bg-app-accent text-white active:scale-95 shadow-app-accent/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                XÁC NHẬN <CheckCircle2 size={18} />
              </button>
            ) : (
              <button 
                onClick={nextRound}
                className="w-full h-14 bg-green-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                TIẾP THEO <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 relative">
        <SunnyMascot 
          message={feedback} 
          mood={gameState === 'checking' ? (roundScore && roundScore > 30 ? 'happy' : 'sad') : 'thinking'}
        />
        {gameState === 'checking' && roundScore !== null && (
          <div className="absolute -top-2 right-2 animate-bounce z-20">
             <span className="bg-amber-400 text-white px-3 py-1 rounded-full font-black text-[10px] shadow-sm border border-white">
               +{roundScore}đ
             </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-2 gap-2">
          {basket.map(choice => {
            const isSelected = selectedIds.includes(choice.id);
            const isCorrect = rounds[currentRoundIdx]?.correctIds.includes(choice.id);
            const isWrongSelection = gameState === 'checking' && isSelected && !isCorrect;
            const isMissedSelection = gameState === 'checking' && !isSelected && isCorrect;

            return (
              <button
                key={choice.id}
                onClick={() => handleToggleChoice(choice.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all
                  ${isSelected 
                    ? 'bg-app-primary text-white border-app-primary shadow-lg scale-[1.02] z-10' 
                    : 'bg-white text-app-text border-slate-100 shadow-sm'}
                  ${gameState === 'checking' && isWrongSelection ? 'bg-red-500 border-red-500 text-white animate-shake' : ''}
                  ${gameState === 'checking' && isMissedSelection ? 'border-amber-400 border-2 bg-amber-50 text-amber-600' : ''}
                `}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0
                  ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                  {choice.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-1">
                    {choice.label}
                  </span>
                  <span className={`text-[8px] font-bold block uppercase opacity-50 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {choice.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default StarDetective;
