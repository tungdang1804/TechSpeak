
/**
 * Gemini Service (Facade)
 * Tập hợp các dịch vụ AI chuyên biệt để Component dễ dàng truy cập.
 */

export { assessPronunciation } from "./ai/assessment/handler";
// Fix: Export createRoleplaySession directly from its source session.ts to avoid "Module has no exported member" and "Cannot redeclare variable" errors
export { createRoleplaySession } from "./ai/conversation/session";
export { 
  sendRoleplayMessage 
} from "./ai/conversation/messaging"; 
export { analyzeConversationHistory } from "./ai/conversation/analysis";
export { fetchWordDetail } from "./ai/dictionaryService";
export { generateGameRounds } from "./ai/gameService";
