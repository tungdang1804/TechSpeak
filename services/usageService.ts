
import { auth } from "./firebase";
import { getUserProfile, incrementAIUsage, ADMIN_UID } from "./userService";

const DAILY_LIMIT = 50;

/**
 * Trả về trạng thái sử dụng hiện tại
 */
export const getUsageStatus = async (uid?: string) => {
  const targetUid = uid || auth.currentUser?.uid || ADMIN_UID;
  
  // BYPASS QUOTA CHỈ DÀNH CHO ADMIN
  if (targetUid === ADMIN_UID) {
    return { used: 0, remaining: DAILY_LIMIT, isExceeded: false, limit: DAILY_LIMIT };
  }

  try {
    const profile = await getUserProfile(targetUid);
    const used = profile.usageCount || 0;
    const remaining = Math.max(0, DAILY_LIMIT - used);
    const isExceeded = used >= DAILY_LIMIT;

    return {
      used,
      remaining,
      isExceeded,
      limit: DAILY_LIMIT
    };
  } catch (error) {
    // Nếu có lỗi, mặc định cho phép dùng để tránh trải nghiệm tệ, 
    // nhưng trong thực tế nên log lỗi này.
    return { used: 0, remaining: DAILY_LIMIT, isExceeded: false, limit: DAILY_LIMIT };
  }
};

/**
 * Đồng bộ hạn mức sử dụng (phiên bản nhanh cho UI)
 */
export const getQuickUsageStatus = (usageCount: number, uid?: string) => {
  const targetUid = uid || auth.currentUser?.uid;
  
  if (targetUid === ADMIN_UID) {
    return { used: 0, remaining: DAILY_LIMIT, isExceeded: false, limit: DAILY_LIMIT };
  }
  
  const remaining = Math.max(0, DAILY_LIMIT - usageCount);
  return {
    used: usageCount,
    remaining,
    isExceeded: usageCount >= DAILY_LIMIT,
    limit: DAILY_LIMIT
  };
};

/**
 * Ghi nhận một lượt sử dụng AI lên Cloud
 */
export const recordUsage = async (uid?: string) => {
  const targetUid = uid || auth.currentUser?.uid;
  
  // KHÔNG ghi nhận lượt dùng cho ADMIN
  if (targetUid === ADMIN_UID || !targetUid) return;
  
  try {
    await incrementAIUsage(targetUid);
  } catch (error) {}
};
