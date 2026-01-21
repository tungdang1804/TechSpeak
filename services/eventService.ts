
import { GameChoice, GameCategory } from '../types';
import { COMMON_CHOICES } from '../data/gameData';

export type BasketType = 'Booking' | 'Technique' | 'Payment' | 'SmallRequests' | 'Mixed';

const BASKETS: Record<string, string[]> = {
  Booking: ['tm_today', 'tm_tomorrow', 'tm_weekend', 'tm_nextweek', 'tm_morning', 'tm_afternoon', 'tm_evening'],
  Technique: ['sh_almond', 'sh_coffin', 'sh_square', 'sh_round', 'sh_oval', 'tl_drill', 'tl_nipper', 'tl_towel', 'dec_charms', 'dec_french', 'dec_stones', 'dec_art'],
  Payment: ['pay_cash', 'pay_card', 'pay_tip'],
  SmallRequests: ['tl_towel', 'col_glitter'] // Shared or specific small items
};

/**
 * Lấy danh sách từ vựng theo "Giỏ" (Basket)
 */
export const getVocabularyFromBasket = (types: BasketType[]): GameChoice[] => {
  let itemIds: string[] = [];
  
  if (types.includes('Mixed')) {
    // Trộn Booking và Technique mặc định cho Mixed
    itemIds = [...BASKETS.Booking, ...BASKETS.Technique];
  } else {
    types.forEach(type => {
      if (BASKETS[type]) itemIds = [...itemIds, ...BASKETS[type]];
    });
  }

  // Loại bỏ trùng lặp và map với dữ liệu gốc
  const uniqueIds = Array.from(new Set(itemIds));
  return COMMON_CHOICES.filter(choice => uniqueIds.includes(choice.id));
};

/**
 * Tạo context sạch cho AI để tránh "loãng" kịch bản
 */
export const generateEventContext = (type: BasketType): { choices: GameChoice[], prompt: string } => {
  const choices = getVocabularyFromBasket([type]);
  const labels = choices.map(c => c.label).join(', ');
  
  let prompt = "";
  switch(type) {
    case 'Booking':
      prompt = "Tập trung vào việc đặt lịch: ngày tháng, giờ giấc và số lượng người.";
      break;
    case 'Technique':
      prompt = "Tập trung vào các kỹ thuật chuyên môn: dáng móng (shape), dụng cụ (tools) và trang trí (decoration).";
      break;
    case 'Payment':
      prompt = "Tập trung vào quy trình thanh toán, tiền tip và các loại thẻ.";
      break;
    case 'Mixed':
      prompt = "Kết hợp tình huống đặt lịch kèm theo các yêu cầu kỹ thuật phức tạp ngay trong cuộc gọi.";
      break;
    default:
      prompt = "Tình huống giao tiếp nail salon tổng quát.";
  }

  return { choices, prompt };
};
