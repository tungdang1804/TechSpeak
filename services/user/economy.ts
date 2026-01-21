
import { increment, arrayUnion } from "firebase/firestore";
import { updateProfileData } from "./profile";

/**
 * Quản lý Điểm và Hạn mức AI
 */

export const awardPoints = async (uid: string, amount: number, reason: string) => {
  await updateProfileData(uid, {
    points: increment(amount) as any,
    pointHistory: arrayUnion({ 
      id: Date.now().toString(), 
      amount, 
      reason, 
      timestamp: new Date().toISOString() 
    }) as any
  });
};

export const useAIQuota = async (uid: string) => {
  await updateProfileData(uid, { usageCount: increment(1) as any });
};

export const calculateStarLevel = (points: number): number => {
  if (points >= 10000) return 5;
  if (points >= 5000) return 4;
  if (points >= 2000) return 3;
  if (points >= 500) return 2;
  if (points >= 100) return 1;
  return 0;
};
