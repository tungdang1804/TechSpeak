
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  arrayUnion,
  increment,
  FieldValue
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

export interface AvatarConfig {
  gender: 'male' | 'female';
  baseId: string;
  items: string[];
}

export interface UserProfile extends UserProgress {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  points: number;
  starLevel: number;
  onboardingComplete: boolean;
  primaryIndustry: 'nails' | 'bartender' | 'flooring' | 'mechanic';
  avatarConfig: AvatarConfig;
  lastDailyReset: string;
  usageCount: number;
  unlockedIndustries: string[];
  unlockedLessons: string[];
  userVocabulary: string[];
  userGrammar: SavedPattern[];
  pointHistory: PointTransaction[];
  isAdmin?: boolean;
}

const getTodayString = (): string => new Date().toISOString().split('T')[0];

let profileCache: Record<string, UserProfile> = {};

export const clearProfileCache = () => {
  profileCache = {};
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  if (!uid) throw new Error("UID is required");
  const today = getTodayString();
  const isAdmin = uid === ADMIN_UID;
  if (profileCache[uid]) return profileCache[uid];

  const defaultProfile: UserProfile = {
    uid: uid,
    displayName: isAdmin ? "Đặng Thanh Tùng" : (auth.currentUser?.displayName ?? "Star Artist"),
    completedLessons: [],
    unlockedLessons: [],
    bestScores: {},
    onboardingComplete: false,
    primaryIndustry: 'nails',
    avatarConfig: {
      gender: 'female',
      baseId: 'base_01',
      items: []
    },
    lastDailyReset: today,
    usageCount: 0,
    points: isAdmin ? 999999 : 0,
    starLevel: isAdmin ? 5 : 0,
    unlockedIndustries: ['nails'],
    userVocabulary: [],
    userGrammar: [],
    pointHistory: [],
    isAdmin: isAdmin
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

export const updateProgress = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

export const addPoints = async (uid: string, amount: number, reason: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(amount),
    pointHistory: arrayUnion({ id: Date.now().toString(), amount, reason, timestamp: new Date().toISOString() })
  });
};

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

export const incrementAIUsage = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { usageCount: increment(1) });
};

export const subscribeToProfile = (uid: string, callback: (profile: UserProfile) => void) => {
  if (!uid) return () => {};
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      const merged = { ...profileCache[uid], ...data };
      profileCache[uid] = merged;
      callback(merged);
    }
  });
};

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
      lastDailyReset: today,
      onboardingComplete: true
    });
  }
  return { success: true };
};
