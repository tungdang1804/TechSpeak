
import React from 'react';
import { GameChoice } from '../../types';

interface DetectiveChoiceGridProps {
  basket: GameChoice[];
  selectedIds: string[];
  correctIds: string[];
  gameState: 'playing' | 'checking';
  onToggle: (id: string) => void;
}

const DetectiveChoiceGrid: React.FC<DetectiveChoiceGridProps> = ({ basket, selectedIds, correctIds, gameState, onToggle }) => {
  return (
    <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar pb-10">
      {basket.map(choice => {
        const isSelected = selectedIds.includes(choice.id);
        const isCorrect = correctIds.includes(choice.id);
        const isChecking = gameState === 'checking';
        
        const isWrong = isChecking && isSelected && !isCorrect;
        const isMissed = isChecking && !isSelected && isCorrect;

        return (
          <button 
            key={choice.id} 
            onClick={() => onToggle(choice.id)}
            disabled={isChecking}
            className={`p-4 rounded-[28px] border text-left transition-all flex items-center gap-3 relative overflow-hidden ${isSelected ? 'bg-app-primary text-white border-app-primary shadow-xl scale-[1.02]' : 'bg-white text-app-text border-slate-100'} ${isWrong ? 'bg-red-500 border-red-500 text-white animate-shake' : ''} ${isMissed ? 'bg-amber-50 border-amber-400 border-2 text-amber-600' : ''}`}
          >
            <div className="text-xl shrink-0 opacity-80">{choice.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tight truncate leading-none">{choice.label}</p>
            </div>
          </button>
        );
      })}
      <style>{`.animate-shake { animation: shake 0.3s ease-in-out; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }`}</style>
    </div>
  );
};

export default React.memo(DetectiveChoiceGrid);
