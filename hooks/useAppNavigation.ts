
import { useState, useCallback } from 'react';

export type TabId = 'home' | 'roadmap' | 'practice' | 'profile';
export type ChallengeType = 'listening' | 'speaking' | 'writing' | null;

export const useAppNavigation = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isChallengeHubOpen, setIsChallengeHubOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeType>(null);
  const [challengeScenario, setChallengeScenario] = useState<{ context: string, user: string, multiplier?: number } | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<any>(null);

  const navigateToTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setActiveLessonId(null);
    setIsChallengeHubOpen(false);
  }, []);

  const openLesson = useCallback((id: string) => {
    setActiveLessonId(id);
  }, []);

  const closeLesson = useCallback(() => {
    setActiveLessonId(null);
  }, []);

  const openChallengeHub = useCallback(() => {
    setIsChallengeHubOpen(true);
  }, []);

  const closeChallengeHub = useCallback(() => {
    setIsChallengeHubOpen(false);
    setActiveChallenge(null);
    setChallengeScenario(null);
  }, []);

  const startChallenge = useCallback((type: ChallengeType, scenario?: any) => {
    setActiveChallenge(type);
    if (scenario) setChallengeScenario(scenario);
  }, []);

  return {
    activeTab, navigateToTab,
    activeLessonId, openLesson, closeLesson,
    isChallengeHubOpen, openChallengeHub, closeChallengeHub,
    activeChallenge, setActiveChallenge, startChallenge,
    challengeScenario,
    unlockTarget, setUnlockTarget
  };
};
