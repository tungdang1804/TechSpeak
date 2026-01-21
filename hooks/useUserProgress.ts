
import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { 
  getUserProfile, 
  subscribeToProfile, 
  updateProgress, 
  UserProfile, 
  addPoints, 
  unlockContent, 
  resetAdminProfile 
} from '../services/userService';
import { subscribeToAuthChanges, loginAnonymously } from '../services/authService';

export const useUserProgress = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuthChange = async (user: User | null) => {
      if (!isMounted) return;

      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (isMounted) {
            setUserProfile(profile);
            setIsLoading(false);
            
            if (profileUnsubRef.current) profileUnsubRef.current();
            profileUnsubRef.current = subscribeToProfile(user.uid, (p) => {
              if (isMounted) setUserProfile(p);
            });
          }
        } catch (e) {
          if (isMounted) setIsLoading(false);
        }
      } else {
        try {
          await loginAnonymously();
        } catch (e) {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    const unsubAuth = subscribeToAuthChanges(handleAuthChange);

    return () => {
      isMounted = false;
      unsubAuth();
      if (profileUnsubRef.current) profileUnsubRef.current();
    };
  }, []);

  const handleScoreUpdate = async (text: string, score: number) => {
    if (!userProfile) return;
    const currentBest = userProfile.bestScores[text] || 0;
    if (score > currentBest) {
      const updatedScores = { ...userProfile.bestScores, [text]: score };
      await updateProgress(userProfile.uid, { bestScores: updatedScores });
    }
  };

  const gainPoints = async (amount: number, reason: string) => {
    if (!userProfile) return;
    await addPoints(userProfile.uid, amount, reason);
  };

  const tryUnlock = async (id: string, type: 'lesson' | 'industry', cost: number) => {
    if (!userProfile) return { success: false, message: "No user" };
    return await unlockContent(userProfile.uid, type, id, cost);
  };

  const adminAction = async (mode: 'reset' | 'test') => {
    if (!userProfile?.isAdmin) return;
    await resetAdminProfile(userProfile.uid, mode);
  };

  return {
    userProfile,
    isLoading,
    handleScoreUpdate,
    gainPoints,
    tryUnlock,
    adminAction
  };
};
