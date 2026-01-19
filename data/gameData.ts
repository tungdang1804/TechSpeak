
import { GameRound, GameChoice } from '../types';

export const COMMON_CHOICES: GameChoice[] = [
  // Shape
  { id: 'sh_almond', label: 'Almond', category: 'Shape', icon: '💅' },
  { id: 'sh_coffin', label: 'Coffin', category: 'Shape', icon: '⚰️' },
  { id: 'sh_square', label: 'Square', category: 'Shape', icon: '⬛' },
  
  // Color & Tone
  { id: 'col_pink', label: 'Pink', category: 'Color', icon: '🩷' },
  { id: 'col_nude', label: 'Nude', category: 'Color', icon: '🫱' },
  { id: 'col_red', label: 'Red', category: 'Color', icon: '❤️' },
  { id: 'col_glitter', label: 'Glitter', category: 'Color', icon: '✨' },
  
  // Deco
  { id: 'dec_charms', label: 'Charms', category: 'Deco', icon: '💎' },
  { id: 'dec_french', label: 'French tips', category: 'Deco', icon: '🏳️' },
  { id: 'dec_stones', label: 'Stones', icon: '💍', category: 'Deco' },

  // Booking / Time
  { id: 'tm_tomorrow', label: 'Tomorrow', category: 'Style', icon: '📅' },
  { id: 'tm_2pm', label: '2:00 PM', category: 'Style', icon: '🕒' },
  { id: 'tm_today', label: 'Today', category: 'Style', icon: '☀️' },

  // Peer Assistance / Tools
  { id: 'tl_drill', label: 'Nail Drill', category: 'Style', icon: '⚙️' },
  { id: 'tl_nipper', label: 'Nipper', category: 'Style', icon: '✂️' },
  { id: 'tl_towel', label: 'Towel', category: 'Style', icon: '🧼' },

  // Payment
  { id: 'pay_cash', label: 'Cash', category: 'Style', icon: '💵' },
  { id: 'pay_card', label: 'Card', category: 'Style', icon: '💳' },
  { id: 'pay_tip', label: 'Tip', category: 'Style', icon: '💰' }
];

export const STAR_DETECTIVE_ROUNDS: GameRound[] = [
  // Mặc định sẽ dùng Gemini để generate, đây là fallback
  {
    id: 'round_1',
    audioText: "I want a long Coffin set, please.",
    correctIds: ['sh_coffin'],
    choices: COMMON_CHOICES
  }
];
