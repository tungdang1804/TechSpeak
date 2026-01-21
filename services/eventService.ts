
import { GameChoice } from '../types';
import { COMMON_CHOICES } from '../data/gameData';

export type BasketType = 'Booking' | 'Technique' | 'Payment' | 'Mixed';

const INDUSTRY_NAMES: Record<string, string> = {
  nails: "Nail Salon",
  bartender: "Cocktail Bar",
  flooring: "Construction Site",
  mechanic: "Auto Repair Shop"
};

/**
 * Lấy danh sách từ vựng theo "Giỏ" và "Ngành"
 */
export const getVocabularyByIndustry = (industryId: string, types: BasketType[]): GameChoice[] => {
  return COMMON_CHOICES.filter(choice => 
    choice.industry === industryId && 
    (types.includes('Mixed') || types.some(t => choice.id.startsWith(t.toLowerCase().substring(0, 2))))
  );
};

/**
 * Tạo context sạch cho AI dựa trên ngành nghề
 */
export const generateEventContext = (industryId: string, type: BasketType): { choices: GameChoice[], prompt: string } => {
  // QUAN TRỌNG: Chỉ lấy choices thuộc ngành hiện tại
  const choices = COMMON_CHOICES.filter(c => c.industry === industryId);
  const industryName = INDUSTRY_NAMES[industryId] || industryId;
  
  let typePrompt = "";
  switch(type) {
    case 'Booking': typePrompt = "scheduling, time and number of people"; break;
    case 'Technique': typePrompt = "technical procedures, tools and professional materials"; break;
    case 'Payment': typePrompt = "pricing, checkout and tipping"; break;
    case 'Mixed': default: typePrompt = "various real-life professional communication scenarios"; break;
  }

  const prompt = `You are a customer at a ${industryName}. Create short conversation snippets focusing on ${typePrompt}. 
  ONLY use terms related to ${industryName}. DO NOT mention any other industries.
  Strictly associate your scenarios with the provided valid choice IDs for this industry.`;

  return { choices, prompt };
};
