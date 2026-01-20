
import { GameRound, GameChoice } from '../types';

export const COMMON_CHOICES: GameChoice[] = [
  // Shape
  { id: 'sh_almond', label: 'Almond Shape', category: 'Shape', icon: '📐' },
  { id: 'sh_coffin', label: 'Coffin Shape', category: 'Shape', icon: '📐' },
  { id: 'sh_square', label: 'Square Shape', category: 'Shape', icon: '📐' },
  { id: 'sh_round', label: 'Round Shape', category: 'Shape', icon: '📐' },
  { id: 'sh_oval', label: 'Oval Shape', category: 'Shape', icon: '📐' },
  
  // Color
  { id: 'col_pink', label: 'Pink Color', category: 'Color', icon: '🎨' },
  { id: 'col_nude', label: 'Nude Color', category: 'Color', icon: '🎨' },
  { id: 'col_red', label: 'Red Color', category: 'Color', icon: '🎨' },
  { id: 'col_glitter', label: 'Glitter Effect', category: 'Color', icon: '🎨' },
  { id: 'col_white', label: 'White Color', category: 'Color', icon: '🎨' },
  
  // Deco
  { id: 'dec_charms', label: 'Charms / Stones', category: 'Deco', icon: '✨' },
  { id: 'dec_french', label: 'French Tips', category: 'Deco', icon: '✨' },
  { id: 'dec_stones', label: 'Rhinestones', category: 'Deco', icon: '✨' },
  { id: 'dec_art', label: 'Custom Nail Art', category: 'Deco', icon: '✨' },

  // Booking / Time Slots (Updated Labels)
  { id: 'tm_today', label: 'Today', category: 'Style', icon: '📅' },
  { id: 'tm_tomorrow', label: 'Tomorrow', category: 'Style', icon: '📅' },
  { id: 'tm_weekend', label: 'This Weekend', category: 'Style', icon: '📅' },
  { id: 'tm_nextweek', label: 'Next Week (incl. Next Fri)', category: 'Style', icon: '📅' },
  { id: 'tm_morning', label: 'Morning (9am-12pm)', category: 'Style', icon: '📅' },
  { id: 'tm_afternoon', label: 'Afternoon (12pm-5pm)', category: 'Style', icon: '📅' },
  { id: 'tm_evening', label: 'Evening (5pm-9pm)', category: 'Style', icon: '📅' },

  // Tools
  { id: 'tl_drill', label: 'Nail Drill', category: 'Tools', icon: '⚙️' },
  { id: 'tl_nipper', label: 'Cuticle Nipper', category: 'Tools', icon: '⚙️' },
  { id: 'tl_towel', label: 'Clean Towel', category: 'Tools', icon: '⚙️' },

  // Payment
  { id: 'pay_cash', label: 'Cash Payment', category: 'Payment', icon: '💳' },
  { id: 'pay_card', label: 'Credit Card', category: 'Payment', icon: '💳' },
  { id: 'pay_tip', label: 'Extra Tip', category: 'Payment', icon: '💳' }
];

export const STAR_DETECTIVE_ROUNDS: GameRound[] = [
  {
    id: 'round_fallback',
    audioText: "I'd like to book an appointment for tomorrow afternoon, please.",
    correctIds: ['tm_tomorrow', 'tm_afternoon'],
    choices: COMMON_CHOICES
  }
];
