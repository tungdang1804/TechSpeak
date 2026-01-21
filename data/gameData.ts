
import { GameRound, GameChoice } from '../types';

export interface IndustrySpecificChoice extends GameChoice {
  industry: string;
}

export const COMMON_CHOICES: IndustrySpecificChoice[] = [
  // --- NAILS INDUSTRY ---
  { id: 'sh_almond', label: 'Almond Shape', category: 'Shape', icon: '📐', industry: 'nails' },
  { id: 'sh_coffin', label: 'Coffin Shape', category: 'Shape', icon: '📐', industry: 'nails' },
  { id: 'sh_square', label: 'Square Shape', category: 'Shape', icon: '📐', industry: 'nails' },
  { id: 'col_pink', label: 'Pink Color', category: 'Color', icon: '🎨', industry: 'nails' },
  { id: 'col_red', label: 'Red Color', category: 'Color', icon: '🎨', industry: 'nails' },
  { id: 'dec_charms', label: 'Charms / Stones', category: 'Deco', icon: '✨', industry: 'nails' },
  { id: 'tm_today', label: 'Today', category: 'Style', icon: '📅', industry: 'nails' },
  { id: 'tm_tomorrow', label: 'Tomorrow', category: 'Style', icon: '📅', industry: 'nails' },
  { id: 'pay_cash', label: 'Cash Payment', category: 'Payment', icon: '💳', industry: 'nails' },
  { id: 'pay_card', label: 'Credit Card', category: 'Payment', icon: '💳', industry: 'nails' },

  // --- FLOORING INDUSTRY (NEW) ---
  { id: 'fl_wood', label: 'Hardwood Floor', category: 'Material', icon: '🪵', industry: 'flooring' },
  { id: 'fl_tile', label: 'Ceramic Tile', category: 'Material', icon: '🧱', industry: 'flooring' },
  { id: 'fl_measurement', label: 'Measurement', category: 'Technical', icon: '📏', industry: 'flooring' },
  { id: 'fl_laminate', label: 'Laminate', category: 'Material', icon: '🪜', industry: 'flooring' },

  // --- BARTENDER INDUSTRY ---
  { id: 'bt_mojito', label: 'Classic Mojito', category: 'Style', icon: '🍸', industry: 'bartender' },
  { id: 'bt_shaker', label: 'Cobbler Shaker', category: 'Tools', icon: '🧪', industry: 'bartender' }
];

export const STAR_DETECTIVE_ROUNDS: GameRound[] = [
  {
    id: 'round_fallback',
    audioText: "I'd like to book an appointment for tomorrow afternoon, please.",
    correctIds: ['tm_tomorrow'],
    choices: COMMON_CHOICES.filter(c => c.industry === 'nails')
  }
];
