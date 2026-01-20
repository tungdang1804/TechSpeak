
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Chỉ đăng nhập ẩn danh nếu chưa có User nào hiện diện
 */
export const loginAnonymously = async () => {
  // Nếu đã có user thì dùng tiếp, không tạo mới để tránh nhảy UID khi hot-reload
  if (auth.currentUser) return auth.currentUser; 
  
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
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
    }
    throw error;
  }
};

/**
 * Nâng cấp tài khoản ẩn danh bằng Google
 */
export const linkGoogleAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await linkWithPopup(user, provider);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/credential-already-in-use') {
      throw new Error("Tài khoản Google này đã được liên kết với một người dùng khác.");
    }
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

export const logout = () => signOut(auth);
