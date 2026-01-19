
import React, { useState, useEffect } from 'react';
import { COMMON_CHOICES } from '../data/gameData';
import { GameRound, GameChoice, GameCategory } from '../types';
import { generateGameRounds } from '../services/geminiService';
import { playAudio } from '../utils/audioUtils';
// Added missing RefreshCw import
import { Volume2, CheckCircle2, Trophy, Play, Search, ArrowRight, Loader2, Star, RefreshCw } from 'lucide-react';

const SunnyMascot = ({ message, mood = 'happy' }: { message: string, mood?: 'happy' | 'sad' | 'thinking' }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-3xl soft-shadow animate-fade-in mb-5 border border-white/50">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${mood === 'happy' ? 'bg-amber-100' : 'bg-red-50'}`}>
      {mood === 'happy' ? '☀️' : mood === 'sad' ? '☁️' : '🤔'}
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Sunny says:</p>
      <p className={`text-[13px] font-bold leading-tight ${mood === 'happy' ? 'text-app-text' : 'text-red-500'}`}>{message}</p>
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
  const [feedback, setFeedback] = useState("Nghe yêu cầu của khách và chọn thẻ đúng nhé!");

  useEffect(() => {
    initGame();
  }, []);

  const initGame = async () => {
    setGameState('loading');
    const newRounds = await generateGameRounds(COMMON_CHOICES);
    if (newRounds.length > 0) {
      setRounds(newRounds);
      setGameState('playing');
    } else {
      // Fallback or error handling
      onBack();
    }
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
    
    // Calculate points for this round
    let currentRoundPoints = 0;
    const correctCount = selectedIds.filter(id => round.correctIds.includes(id)).length;
    const wrongCount = selectedIds.filter(id => !round.correctIds.includes(id)).length;
    const missedCount = round.correctIds.filter(id => !selectedIds.includes(id)).length;

    // Point system: +20 per correct, -10 per wrong/missed
    currentRoundPoints = (correctCount * 20) - (wrongCount * 10) - (missedCount * 5);
    if (currentRoundPoints < 0) currentRoundPoints = 0;
    
    // Bonus for perfect score
    const isPerfect = wrongCount === 0 && missedCount === 0;
    if (isPerfect) currentRoundPoints += 40;

    setRoundScore(currentRoundPoints);
    setTotalScore(prev => prev + currentRoundPoints);
    setGameState('checking');

    if (isPerfect) {
      setFeedback("Perfect! Chị khách sẽ rất hài lòng với sự tinh tế của bạn! ✨");
    } else if (correctCount > 0) {
      setFeedback(`Khá tốt, nhưng bạn quên mất: ${round.correctIds.filter(id => !selectedIds.includes(id)).map(id => COMMON_CHOICES.find(c => c.id === id)?.label).join(', ')}`);
    } else {
      setFeedback("Ồ không, có vẻ bạn nghe nhầm rồi. Hãy thử nghe lại thật kỹ nhé!");
    }
  };

  const nextRound = () => {
    if (currentRoundIdx < rounds.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedIds([]);
      setGameState('playing');
      setRoundScore(null);
      setFeedback("Nghe yêu cầu của khách và chọn thẻ đúng nhé!");
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setCurrentRoundIdx(0);
    setSelectedIds([]);
    setTotalScore(0);
    setRoundScore(null);
    initGame();
  };

  if (gameState === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-app-bg animate-pulse">
        <div className="w-24 h-24 bg-white rounded-5xl soft-shadow flex items-center justify-center mb-8 relative">
           <Loader2 size={40} className="text-app-primary animate-spin" />
           <div className="absolute -top-2 -right-2 text-3xl">🕵️‍♂️</div>
        </div>
        <h3 className="text-lg font-black text-app-text mb-2">Đang kết nối khách hàng...</h3>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-center">Sunny đang chuẩn bị kịch bản thử thách cho bạn</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-app-bg">
        <div className="w-20 h-20 bg-app-accent/10 rounded-3xl flex items-center justify-center mb-6 text-app-accent soft-shadow">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-black text-app-text mb-2">Thám Tử Hoàn Tất!</h2>
        <p className="text-slate-500 mb-8 font-medium text-sm">Bạn đã xuất sắc vượt qua các thử thách nghe hôm nay.</p>
        <div className="bg-white p-8 rounded-5xl soft-shadow mb-8 w-full max-w-xs border border-white/50">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tổng điểm đạt được</p>
          <p className="text-5xl font-black text-app-primary">{totalScore}</p>
        </div>
        <button onClick={onBack} className="w-full max-w-[240px] py-4 bg-app-primary text-white rounded-2xl font-black soft-shadow active:scale-95 transition-all mb-4">
          VỀ TRANG CHỦ
        </button>
        <button onClick={resetGame} className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <RefreshCw size={14} /> Chơi lại thử thách mới
        </button>
      </div>
    );
  }

  const groupedChoices = round.choices.reduce((acc, choice) => {
    if (!acc[choice.category]) acc[choice.category] = [];
    acc[choice.category].push(choice);
    return acc;
  }, {} as Record<GameCategory, GameChoice[]>);

  return (
    <div className="h-full flex flex-col bg-app-bg p-5 overflow-y-auto no-scrollbar pb-32">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between mb-5 px-1">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app-primary text-white flex items-center justify-center font-black text-sm">
               {currentRoundIdx + 1}
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">TIẾN TRÌNH</span>
               <div className="flex gap-1 mt-0.5">
                  {rounds.map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i <= currentRoundIdx ? 'bg-app-primary' : 'bg-slate-200'}`} />
                  ))}
               </div>
            </div>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">TỔNG ĐIỂM</span>
            <div className="text-lg font-black text-app-accent flex items-center gap-1">
               <Star size={18} fill="currentColor" /> {totalScore}
            </div>
         </div>
      </div>

      <SunnyMascot 
        message={feedback} 
        mood={gameState === 'checking' ? (roundScore && roundScore > 50 ? 'happy' : 'sad') : 'thinking'}
      />

      {/* Audio Section */}
      <div className="bg-white p-5 rounded-4xl soft-shadow border border-white/50 mb-6 flex items-center gap-5">
        <button 
          onClick={() => playAudio(round.audioText)}
          className="w-14 h-14 bg-app-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-app-primary/20 active:scale-90 transition-all shrink-0"
        >
          <Volume2 size={24} />
        </button>
        <div className="flex-1">
           <p className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-1">Customer Voice</p>
           <p className="text-xs font-bold text-slate-400 italic">Nhấn nút để nghe lại yêu cầu</p>
        </div>
      </div>

      {/* Round Score Animation */}
      {gameState === 'checking' && roundScore !== null && (
        <div className="mb-6 animate-bounce text-center">
           <span className="bg-app-accent text-white px-6 py-2 rounded-full font-black text-sm soft-shadow">
             +{roundScore} POINTS! 🎯
           </span>
        </div>
      )}

      {/* Choices Grid */}
      <div className="space-y-6">
        {Object.entries(groupedChoices).map(([category, items]) => (
          <div key={category} className="animate-fade-in-up">
            <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
               <Search size={10} /> {category}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {items.map(choice => {
                const isSelected = selectedIds.includes(choice.id);
                const isCorrect = round.correctIds.includes(choice.id);
                const isWrongSelection = gameState === 'checking' && isSelected && !isCorrect;
                const isMissedSelection = gameState === 'checking' && !isSelected && isCorrect;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleToggleChoice(choice.id)}
                    className={`px-4 py-3.5 rounded-2xl border font-black text-[11px] transition-all flex items-center gap-3 shadow-sm
                      ${isSelected 
                        ? 'bg-app-primary text-white border-app-primary soft-shadow scale-[1.02]' 
                        : 'bg-white text-app-text border-slate-100 hover:border-app-primary/30'}
                      ${gameState === 'checking' && isWrongSelection ? 'bg-red-500 border-red-500 text-white animate-shake' : ''}
                      ${gameState === 'checking' && isMissedSelection ? 'border-app-accent border-2 bg-app-accent/10 text-app-accent' : ''}
                    `}
                  >
                    <span className="text-base">{choice.icon}</span>
                    <span className="truncate">{choice.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="mt-10">
        {gameState === 'playing' ? (
          <button 
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className={`w-full py-4.5 rounded-3xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2
              ${selectedIds.length > 0 ? 'bg-app-accent text-white shadow-app-accent/20 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            KIỂM TRA ĐÁP ÁN <CheckCircle2 size={18} />
          </button>
        ) : (
          <button 
            onClick={nextRound}
            className="w-full py-4.5 bg-app-primary text-white rounded-3xl font-black text-sm soft-shadow active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {currentRoundIdx < rounds.length - 1 ? 'TIẾP TỤC THỬ THÁCH' : 'XEM KẾT QUẢ'} <ArrowRight size={18} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StarDetective;
