
import { useState, useEffect, useRef } from 'react';
import { GameRound, GameChoice } from '../../types';
import { generateGameRounds } from '../../services/ai/gameService';
import { COMMON_CHOICES } from '../../data/gameData';
import { playAudio, stopAllAudio, preloadAudio } from '../../utils/audioUtils';

export const useDetectiveLogic = (onBack: () => void) => {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'checking' | 'finished'>('loading');
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [feedback, setFeedback] = useState("Sẵn sàng thám tử nhé!");
  const [basket, setBasket] = useState<GameChoice[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const autoPlayTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    initGame();
    return () => {
      clearAllTimers();
      stopAllAudio();
    };
  }, []);

  const clearAllTimers = () => {
    if (autoPlayTimerRef.current) window.clearTimeout(autoPlayTimerRef.current);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
  };

  const initGame = async () => {
    setGameState('loading');
    const interval = window.setInterval(() => setLoadingProgress(p => Math.min(p + 15, 90)), 200);
    
    try {
      const newRounds = await generateGameRounds('Mixed');
      if (newRounds.length > 0) {
        await Promise.all(newRounds.map(r => preloadAudio(r.audioText, 'normal')));
        setRounds(newRounds);
        setMaxScore(newRounds.length * 50);
        setGameState('playing');
        setupRound(newRounds[0]);
      } else {
        onBack();
      }
    } catch (e) {
      onBack();
    } finally {
      window.clearInterval(interval);
    }
  };

  const setupRound = (round: GameRound) => {
    const correctOnes = COMMON_CHOICES.filter(c => round.correctIds.includes(c.id));
    const distractors = COMMON_CHOICES.filter(c => !round.correctIds.includes(c.id)).sort(() => Math.random() - 0.5);
    const result = [...correctOnes, ...distractors.slice(0, 12 - correctOnes.length)];
    setBasket(result.sort(() => Math.random() - 0.5));
    startAudioSequence(round.audioText);
  };

  const startAudioSequence = (text: string) => {
    clearAllTimers();
    setCountdown(3);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev && prev > 1) return prev - 1;
        window.clearInterval(countdownIntervalRef.current!);
        return null;
      });
    }, 1000);

    autoPlayTimerRef.current = window.setTimeout(() => {
      playAudio(text, 'normal');
      setCountdown(null);
    }, 3000);
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
    setFeedback(wrongCount === 0 && missedCount === 0 ? "Chính xác tuyệt đối! 🥳" : "Có vẻ bạn bỏ lỡ vài ý rồi.");
  };

  const nextRound = () => {
    if (currentRoundIdx < rounds.length - 1) {
      const nextIdx = currentRoundIdx + 1;
      setCurrentRoundIdx(nextIdx);
      setSelectedIds([]);
      setGameState('playing');
      setRoundScore(null);
      setFeedback("Sẵn sàng thám tử nhé!");
      setupRound(rounds[nextIdx]);
    } else {
      setGameState('finished');
    }
  };

  const toggleChoice = (id: string) => {
    if (gameState !== 'playing') return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return {
    rounds, currentRoundIdx, selectedIds, gameState, roundScore,
    totalScore, maxScore, feedback, basket, countdown, loadingProgress,
    toggleChoice, handleConfirm, nextRound
  };
};
