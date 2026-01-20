
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  arrayUnion,
  increment
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProgress } from "../types";

// UID cố định cho Admin (Đặng Thanh Tùng)
export const ADMIN_UID = "dang-thanh-tung-admin-account";

export interface PointTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface UserProfile extends UserProgress {
  uid: string;
  lastDailyReset: string;
  usageCount: number;
  email?: string;
  displayName?: string;
  photoURL?: string;
  points: number;
  unlockedIndustries: string[];
  unlockedLessons: string[];
  pointHistory: PointTransaction[];
  isAdmin?: boolean;
}

const getTodayString = (): string => new Date().toISOString().split('T')[0];

// In-memory cache for profiles
const profileCache: Record<string, UserProfile> = {};

/**
 * Khởi tạo hoặc lấy Profile người dùng từ Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const today = getTodayString();
  const isAdmin = uid === ADMIN_UID;

  if (profileCache[uid]) return profileCache[uid];

  const defaultProfile: UserProfile = {
    uid,
    completedLessons: [],
    unlockedLessons: [],
    bestScores: {},
    lastDailyReset: today,
    usageCount: 0,
    points: isAdmin ? 999999 : 0,
    unlockedIndustries: ['nails'],
    pointHistory: [],
    isAdmin: isAdmin,
    displayName: isAdmin ? "Đặng Thanh Tùng" : undefined
  };

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, defaultProfile);
      } catch (e) {
        console.warn("Could not create user document - permissions likely restricted.", e);
      }
      profileCache[uid] = defaultProfile;
      return defaultProfile;
    }

    const data = userSnap.data() as UserProfile;
    
    // Đảm bảo các flag hệ thống luôn đúng cho Admin
    if (isAdmin) {
      data.isAdmin = true;
      data.displayName = "Đặng Thanh Tùng";
      if (data.points === undefined) data.points = 999999;
    }

    profileCache[uid] = data;
    return data;
  } catch (error: any) {
    console.error("Firestore read error:", error);
    profileCache[uid] = defaultProfile;
    return defaultProfile;
  }
};

/**
 * Reset hoặc Nạp điểm cho Admin để Test
 */
export const resetAdminProfile = async (uid: string, mode: 'reset' | 'test') => {
  const updates: Partial<UserProfile> = mode === 'reset'
    ? { 
        points: 0, 
        unlockedLessons: [], 
        completedLessons: [], 
        bestScores: {}, 
        usageCount: 0,
        pointHistory: [] 
      }
    : { 
        points: 999999, 
        unlockedLessons: [], 
        completedLessons: [], 
        bestScores: {}, 
        usageCount: 0 
      };

  if (profileCache[uid]) {
    profileCache[uid] = { ...profileCache[uid], ...updates };
  }

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Admin action failed (Check Firebase Rules):", error);
  }
  return updates;
};

/**
 * Lắng nghe thay đổi Profile với xử lý lỗi Permission
 */
export const subscribeToProfile = (uid: string, callback: (profile: UserProfile) => void) => {
  try {
    const userRef = doc(db, "users", uid);
    return onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserProfile;
          profileCache[uid] = data;
          callback(data);
        }
      },
      (error) => {
        // Handle permission-denied gracefully
        if (error.code === 'permission-denied') {
          console.warn("Firestore permissions denied. Ensure security rules allow access or user is logged in.");
          // Fallback to cache if available
          if (profileCache[uid]) callback(profileCache[uid]);
        } else {
          console.error("onSnapshot error:", error);
        }
      }
    );
  } catch (e) {
    return () => {};
  }
};

export const updateProgress = async (uid: string, updates: Partial<UserProfile>) => {
  if (profileCache[uid]) {
    profileCache[uid] = { ...profileCache[uid], ...updates };
  }
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("updateProgress failed:", error);
  }
};

export const addPoints = async (uid: string, amount: number, reason: string) => {
  if (profileCache[uid]) {
    profileCache[uid].points += amount;
  }

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      points: increment(amount),
      pointHistory: arrayUnion({
        id: Date.now().toString(),
        amount,
        reason,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error("addPoints failed:", error);
  }
};

export const unlockContent = async (uid: string, type: 'lesson' | 'industry', contentId: string, cost: number) => {
  const profile = profileCache[uid] || await getUserProfile(uid);
  if (profile.points < cost && !profile.isAdmin) {
    return { success: false, message: "Không đủ điểm Star." };
  }

  const updates: any = {
    points: profile.isAdmin ? profile.points : increment(-cost),
    [type === 'lesson' ? 'unlockedLessons' : 'unlockedIndustries']: arrayUnion(contentId)
  };

  if (profileCache[uid]) {
    if (!profile.isAdmin) profileCache[uid].points -= cost;
    if (type === 'lesson') profileCache[uid].unlockedLessons.push(contentId);
    else profileCache[uid].unlockedIndustries.push(contentId);
  }

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("unlockContent failed:", error);
    return { success: false, message: "Lỗi hệ thống khi mở khóa." };
  }
  
  return { success: true };
};

export const incrementAIUsage = async (uid: string) => {
  if (profileCache[uid]) profileCache[uid].usageCount++;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { usageCount: increment(1) });
  } catch (error) {}
};
