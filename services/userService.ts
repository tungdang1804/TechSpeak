
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  arrayUnion,
  increment
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { UserProgress } from "../types";

export const ADMIN_UID = "dang-thanh-tung-admin-account";

export interface PointTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface SavedPattern {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  lessonId?: string;
  timestamp: string;
}

export interface UserProfile extends UserProgress {
  uid: string;
  lastDailyReset: string;
  usageCount: number;
  email?: string;
  displayName: string;
  photoURL?: string;
  points: number;
  starLevel: number;
  unlockedIndustries: string[];
  unlockedLessons: string[];
  userVocabulary: string[]; // Mảng ID từ vựng đã lưu
  userGrammar: SavedPattern[]; // Mảng mẫu câu đã lưu
  pointHistory: PointTransaction[];
  isAdmin?: boolean;
}

const getTodayString = (): string => new Date().toISOString().split('T')[0];

let profileCache: Record<string, UserProfile> = {};

export const clearProfileCache = () => {
  profileCache = {};
};

const calculateStarLevel = (data: Partial<UserProfile>): number => {
  if (data.uid === ADMIN_UID || data.isAdmin) return 5;
  const points = data.points || 0;
  const completedLessons = data.completedLessons || [];
  if (points >= 10000 && completedLessons.length >= 5) return 5;
  if (points >= 7000) return 4;
  if (points >= 5000) return 3;
  if (completedLessons.length >= 3) return 2;
  if (completedLessons.length >= 1) return 1;
  return 0;
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  if (!uid) throw new Error("UID is required");
  const today = getTodayString();
  const isAdmin = uid === ADMIN_UID;
  if (profileCache[uid]) return profileCache[uid];

  const defaultProfile: UserProfile = {
    uid: uid,
    completedLessons: [],
    unlockedLessons: [],
    bestScores: {},
    lastDailyReset: today,
    usageCount: 0,
    points: isAdmin ? 999999 : 0,
    starLevel: isAdmin ? 5 : 0,
    unlockedIndustries: ['nails'],
    userVocabulary: [],
    userGrammar: [],
    pointHistory: [],
    isAdmin: isAdmin,
    displayName: isAdmin ? "Đặng Thanh Tùng" : (auth.currentUser?.displayName ?? "Học viên Star")
  };

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const safeProfile = JSON.parse(JSON.stringify(defaultProfile));
      await setDoc(userRef, safeProfile);
      profileCache[uid] = safeProfile;
      return safeProfile;
    }
    const data = userSnap.data() as UserProfile;
    let usageCount = data.usageCount || 0;
    if (data.lastDailyReset !== today) {
      usageCount = 0;
      await updateDoc(userRef, { usageCount: 0, lastDailyReset: today });
    }
    const mergedProfile: UserProfile = { ...defaultProfile, ...data, uid, usageCount, isAdmin };
    profileCache[uid] = mergedProfile;
    return mergedProfile;
  } catch (error) {
    return defaultProfile;
  }
};

export const saveToLibraryVocab = async (uid: string, vocabId: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { userVocabulary: arrayUnion(vocabId) });
};

export const saveToLibraryGrammar = async (uid: string, pattern: SavedPattern) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { userGrammar: arrayUnion(pattern) });
};

export const subscribeToProfile = (uid: string, callback: (profile: UserProfile) => void) => {
  if (!uid) return () => {};
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as UserProfile;
      profileCache[uid] = { ...profileCache[uid], ...data };
      callback(profileCache[uid]);
    }
  });
};

export const addPoints = async (uid: string, amount: number, reason: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(amount),
    pointHistory: arrayUnion({ id: Date.now().toString(), amount, reason, timestamp: new Date().toISOString() })
  });
};

// Fix: Add message to return object to match union type in tryUnlock
export const unlockContent = async (uid: string, type: 'lesson' | 'industry', contentId: string, cost: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(-cost),
    [type === 'lesson' ? 'unlockedLessons' : 'unlockedIndustries']: arrayUnion(contentId)
  });
  return { success: true, message: "Mở khóa thành công!" };
};

export const incrementAIUsage = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { usageCount: increment(1) });
};

// Fix: Export updateProgress as it is used in useUserProgress.ts
export const updateProgress = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

// Fix: Export resetAdminProfile as it is used in useUserProgress.ts
export const resetAdminProfile = async (uid: string, mode: 'reset' | 'test') => {
  const userRef = doc(db, "users", uid);
  if (mode === 'reset') {
    const today = getTodayString();
    await updateDoc(userRef, {
      completedLessons: [],
      unlockedLessons: [],
      bestScores: {},
      points: 999999,
      usageCount: 0,
      lastDailyReset: today
    });
  }
  return { success: true };
};
