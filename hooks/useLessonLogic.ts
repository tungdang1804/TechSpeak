
import { useState, useCallback } from 'react';
import { Lesson } from '../types';
import { auth } from '../services/firebase';
import { saveToLibraryVocab } from '../services/userService';

export const useLessonLogic = (lesson: Lesson, savedScores: Record<string, number>) => {
  const [activeTab, setActiveTab] = useState<'situation' | 'vocab' | 'grammar'>('situation');
  const [sessionScores, setSessionScores] = useState<Record<string, number>>({});
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [phraseToRecord, setPhraseToRecord] = useState<{ text: string, id: string } | null>(null);
  const [lessonListOpen, setLessonListOpen] = useState(false);
  const [savedVocabIds, setSavedVocabIds] = useState<string[]>([]);
  const [selectedLookupWord, setSelectedLookupWord] = useState<string | null>(null);

  const handleScoreUpdate = useCallback((text: string, score: number) => {
    setSessionScores(prev => ({
      ...prev,
      [text]: Math.max(score, prev[text] || 0, savedScores[text] || 0)
    }));
  }, [savedScores]);

  const getBestScore = useCallback((text: string) => 
    Math.max(sessionScores[text] || 0, savedScores[text] || 0), 
  [sessionScores, savedScores]);

  const openRecordModal = useCallback((text: string, id: string) => {
    setPhraseToRecord({ text, id });
    setRecordModalOpen(true);
  }, []);

  const handleSaveVocab = useCallback(async (vocabId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await saveToLibraryVocab(uid, vocabId);
    setSavedVocabIds(prev => [...prev, vocabId]);
  }, []);

  return {
    activeTab, setActiveTab,
    sessionScores, handleScoreUpdate, getBestScore,
    recordModalOpen, setRecordModalOpen,
    phraseToRecord, openRecordModal,
    lessonListOpen, setLessonListOpen,
    savedVocabIds, handleSaveVocab,
    selectedLookupWord, setSelectedLookupWord
  };
};
