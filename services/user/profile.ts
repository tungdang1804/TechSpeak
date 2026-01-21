
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { UserProfile } from "../../types";

const ADMIN_UID = "dang-thanh-tung-admin-account";

export const getInitialProfile = (uid: string): UserProfile => ({
  uid,
  displayName: auth.currentUser?.displayName ?? "Star Artist",
  completedLessons: [],
  unlockedLessons: [],
  bestScores: {},
  onboardingComplete: false,
  primaryIndustry: 'nails',
  avatarConfig: { gender: 'female', baseId: 'base_01', items: [] },
  lastDailyReset: new Date().toISOString().split('T')[0],
  usageCount: 0,
  points: uid === ADMIN_UID ? 999999 : 0,
  starLevel: uid === ADMIN_UID ? 5 : 0,
  unlockedIndustries: ['nails'],
  userVocabulary: [],
  userGrammar: [],
  pointHistory: [],
  isAdmin: uid === ADMIN_UID
});

export const fetchProfile = async (uid: string): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const newProfile = getInitialProfile(uid);
    await setDoc(userRef, newProfile);
    return newProfile;
  }
  
  return { ...getInitialProfile(uid), ...userSnap.data() } as UserProfile;
};

export const updateProfileData = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

export const watchProfile = (uid: string, callback: (p: UserProfile) => void) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback(snap.data() as UserProfile);
  });
};
