
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  linkWithCredential, 
  linkWithPopup,
  EmailAuthProvider,
  updateProfile,
  User
} from "firebase/auth";
import { auth } from "./firebase";
import { clearProfileCache } from "./userService";

/**
 * Đăng nhập ẩn danh
 */
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Anonymous login error:", error);
    throw error;
  }
};

/**
 * Nâng cấp tài khoản ẩn danh bằng Email/Password
 */
export const upgradeAccount = async (email: string, password: string, displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const credential = EmailAuthProvider.credential(email, password);
  
  try {
    const userCredential = await linkWithCredential(user, credential);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
    }
    throw error;
  }
};

/**
 * Đăng nhập hoặc Liên kết bằng Google
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      try {
        const userCredential = await linkWithPopup(auth.currentUser, provider);
        return userCredential.user;
      } catch (linkError: any) {
        if (linkError.code === 'auth/credential-already-in-use' || linkError.code === 'auth/email-already-in-use') {
          const userCredential = await signInWithPopup(auth, provider);
          return userCredential.user;
        }
        throw linkError;
      }
    } else {
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    }
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    throw error;
  }
};

/**
 * Đăng nhập bằng Email
 */
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Lắng nghe thay đổi trạng thái đăng nhập
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Đăng xuất và dọn dẹp
 */
export const logout = async () => {
  try {
    clearProfileCache();
    await signOut(auth);
  } catch (e) {
    console.error("Logout failed:", e);
  }
};
