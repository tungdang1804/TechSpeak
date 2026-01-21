
import { auth } from "./firebase";
import { getUserProfile, ADMIN_UID } from "./userService";

/**
 * Trả về trạng thái sử dụng hiện tại
 */
export const getUsageStatus = async (uid?: string) => {
  const targetUid = uid || auth.currentUser?.uid;
  
  if (!targetUid) {
    return { used: 0, remaining: 0, isExceeded: true, limit: 50 };
  }

  // Admin bypass
  if (targetUid === ADMIN_UID) {
    return { used: 0, remaining: 9999, isExceeded: false, limit: 9999 };
  }

  try {
    const profile = await getUserProfile(targetUid);
    const isGuest = auth.currentUser?.isAnonymous;
    
    // Công thức: Khách: 50. Học viên: 100 + (Star * 20)
    const limit = isGuest ? 50 : (100 + (profile.starLevel * 20));
    
    const used = profile.usageCount || 0;
    const remaining = Math.max(0, limit - used);
    const isExceeded = used >= limit;

    return { used, remaining, isExceeded, limit };
  } catch (error) {
    return { used: 0, remaining: 50, isExceeded: false, limit: 50 };
  }
};

export const recordUsage = async (uid?: string) => {
  const targetUid = uid || auth.currentUser?.uid;
  if (targetUid === ADMIN_UID || !targetUid) return;
  try {
    const { incrementAIUsage } = await import('./userService');
    await incrementAIUsage(targetUid);
  } catch (error) {}
};
