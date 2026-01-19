
import React, { useState, useEffect, useRef } from 'react';
import { COMMON_CHOICES } from '../data/gameData';
import { GameRound, GameChoice } from '../types';
import { generateGameRounds } from '../services/geminiService';
import { playAudio } from '../utils/audioUtils';
import { Volume2, CheckCircle2, Trophy, ArrowRight, Loader2, Star, RefreshCw, PlayCircle, Clock } from 'lucide-react';

const SunnyMascot = ({ message, mood = 'happy' }: { message: string, mood?: 'happy' | 'sad' | 'thinking' }) => (
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

const StarDetective: React.FC<StarDetectiveProps> = ({ onBack }) => {
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

  useEffect(() => {
    initGame();
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && rounds[currentRoundIdx]) {
      setupBasket();
      startAutoPlaySequence();
    }
  }, [currentRoundIdx, gameState, rounds]);

  const clearAllTimers = () => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const startAutoPlaySequence = () => {
    clearAllTimers();
    setCountdown(5);
    
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev !== null && prev > 1) return prev - 1;
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        return null;
      });
    }, 1000);

    autoPlayTimerRef.current = window.setTimeout(() => {
      playAudio(rounds[currentRoundIdx].audioText);
      setCountdown(null);
    }, 5000);
  };

  const setupBasket = () => {
    const round = rounds[currentRoundIdx];
    if (!round) return;

    // Logic rổ từ khóa 20 items: 
    // 1. Đáp án đúng
    const correct = COMMON_CHOICES.filter(c => round.correctIds.includes(c.id));
    // 2. Các từ cùng category (ví dụ cùng là shape)
    const sameCategory = COMMON_CHOICES.filter(c => 
      !round.correctIds.includes(c.id) && 
      correct.some(cor => cor.category === c.category)
    );
    // 3. Random các từ còn lại để đủ 20
    const others = COMMON_CHOICES.filter(c => 
      !round.correctIds.includes(c.id) && 
      !sameCategory.some(s => s.id === c.id)
    );

    const fullList = [...correct, ...sameCategory, ...others].slice(0, 20);
    setBasket(fullList.sort(() => Math.random() - 0.5));
  };

  const initGame = async () => {
    setGameState('loading');
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 98) { clearInterval(interval); return 98; }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 200);

    const newRounds = await generateGameRounds(COMMON_CHOICES);
    
    clearInterval(interval);
    setLoadingProgress(100);
    
    setTimeout(() => {
      if (newRounds.length > 0) {
        setRounds(newRounds);
        setMaxScore(newRounds.length * 50); // Giả định max 50/round
        setGameState('playing');
      } else {
        onBack();
      }
    }, 400);
  };

  const round = rounds[currentRoundIdx];

  const handleToggleChoice = (id: string) => {
    if (gameState !== 'playing') return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (!round) return;
    clearAllTimers();
    setCountdown(null);

    const correctCount = selectedIds.filter(id => round.correctIds.includes(id)).length;
    const wrongCount = selectedIds.filter(id => !round.correctIds.includes(id)).length;
    const missedCount = round.correctIds.filter(id => !selectedIds.includes(id)).length;

    let points = (correctCount * 20) - (wrongCount * 10) - (missedCount * 5);
    if (wrongCount === 0 && missedCount === 0) points += 10; // Bonus hoàn hảo
    if (points < 0) points = 0;

    setRoundScore(points);
    setTotalScore(prev => prev + points);
    setGameState('checking');

    if (wrongCount === 0 && missedCount === 0) {
      setFeedback("Tuyệt đỉnh! Bạn nghe không sót một chữ nào! 🌟");
    } else {
      setFeedback(`Gần đúng rồi! Khách thực ra muốn: ${round.correctIds.map(id => COMMON_CHOICES.find(c => c.id === id)?.label).join(', ')}`);
    }
  };

  const nextRound = () => {
    if (currentRoundIdx < rounds.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedIds([]);
      setGameState('playing');
      setRoundScore(null);
      setFeedback("Cố gắng cho round tiếp theo nhé!");
    } else {
      setGameState('finished');
    }
  };

  const getEncouragement = () => {
    const ratio = totalScore / maxScore;
    if (ratio >= 0.9) return "Bạn có đôi tai của một chuyên gia thực thụ! 🏆";
    if (ratio >= 0.7) return "Rất ấn tượng! Bạn đã nắm bắt được hầu hết ý muốn của khách.";
    return "Khởi đầu tốt! Hãy luyện tập thêm để phản xạ nhanh hơn với các từ khóa nhé.";
  };

  if (gameState === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 bg-app-bg">
        <div className="relative mb-8">
           <Loader2 size={60} className="text-app-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-app-primary">
             {loadingProgress}%
           </div>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center animate-pulse">
          Đang mời khách hàng vào tiệm...
        </p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-app-bg animate-fade-in overflow-y-auto">
        <div className="w-20 h-20 bg-app-accent/10 rounded-3xl flex items-center justify-center mb-6 text-app-accent soft-shadow">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-black text-app-text mb-2">Thám Tử Hoàn Tất!</h2>
        <div className="bg-white p-8 rounded-5xl soft-shadow mb-6 w-full max-w-xs border border-white/50 relative">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Kết quả của bạn</p>
          <p className="text-5xl font-black text-app-primary">{totalScore}<span className="text-lg text-slate-300">/{maxScore}</span></p>
        </div>
        <p className="text-sm font-bold text-app-primary italic mb-8 px-6">"{getEncouragement()}"</p>
        <button onClick={onBack} className="w-full max-w-[240px] py-4 bg-app-primary text-white rounded-2xl font-black shadow-lg mb-4 active:scale-95 transition-all uppercase tracking-widest text-xs">Về Trang Chủ</button>
        <button onClick={() => window.location.reload()} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"><RefreshCw size={14} /> Thử thách mới</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-app-bg p-5 overflow-hidden">
      {/* 1. Header & Controls (Ngang hàng) */}
      <div className="shrink-0 mb-4 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase">Khách {currentRoundIdx + 1}/5</span>
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
              onClick={() => { clearAllTimers(); setCountdown(null); playAudio(round.audioText); }}
              className="w-14 h-14 bg-app-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
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
                KIỂM TRA <CheckCircle2 size={18} />
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
          <div className="absolute -top-2 right-2 animate-bounce">
             <span className="bg-amber-400 text-white px-3 py-1 rounded-full font-black text-[10px] shadow-sm">
               +{roundScore}đ
             </span>
          </div>
        )}
      </div>

      {/* 2. Basket Grid (20 items) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-4 gap-2">
          {basket.map(choice => {
            const isSelected = selectedIds.includes(choice.id);
            const isCorrect = round.correctIds.includes(choice.id);
            const isWrongSelection = gameState === 'checking' && isSelected && !isCorrect;
            const isMissedSelection = gameState === 'checking' && !isSelected && isCorrect;

            return (
              <button
                key={choice.id}
                onClick={() => handleToggleChoice(choice.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all h-18
                  ${isSelected 
                    ? 'bg-app-primary text-white border-app-primary shadow-lg scale-[1.05] z-10' 
                    : 'bg-white text-app-text border-slate-100 shadow-sm'}
                  ${gameState === 'checking' && isWrongSelection ? 'bg-red-500 border-red-500 text-white animate-shake' : ''}
                  ${gameState === 'checking' && isMissedSelection ? 'border-amber-400 border-2 bg-amber-50 text-amber-600' : ''}
                `}
              >
                <span className="text-xl mb-1">{choice.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-tight text-center leading-tight line-clamp-1 w-full">
                  {choice.label}
                </span>
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
