import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "./firebase";
import { SavedPattern, UserProfile } from "../types";

export type { UserProfile };

export { 
  fetchProfile as getUserProfile, 
  updateProfileData as updateProgress,
  watchProfile as subscribeToProfile,
  getInitialProfile
} from "./user/profile";

export { 
  awardPoints as addPoints, 
  useAIQuota as incrementAIUsage,
  calculateStarLevel
} from "./user/economy";

export const saveToLibraryVocab = async (uid: string, vocabId: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { userVocabulary: arrayUnion(vocabId) });
};

export const saveToLibraryGrammar = async (uid: string, pattern: SavedPattern) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { userGrammar: arrayUnion(pattern) });
};

export const unlockContent = async (uid: string, type: 'lesson' | 'industry', contentId: string, cost: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(-cost),
    [type === 'lesson' ? 'unlockedLessons' : 'unlockedIndustries']: arrayUnion(contentId)
  });
  return { success: true, message: "Mở khóa thành công!" };
};

export const clearProfileCache = () => {};

export const resetAdminProfile = async (uid: string, mode: 'reset' | 'test') => {
  const userRef = doc(db, "users", uid);
  if (mode === 'reset') {
    await updateDoc(userRef, {
      completedLessons: [],
      unlockedLessons: [],
      points: 0,
      usageCount: 0
    });
  }
};

export const ADMIN_UID = "dang-thanh-tung-admin-account";