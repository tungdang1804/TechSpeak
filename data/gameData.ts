
import { GameRound, GameChoice } from '../types';

// Added export keyword to resolve local declaration error
export const COMMON_CHOICES: GameChoice[] = [
  { id: 'sh_almond', label: 'Almond', category: 'Shape', icon: '💅' },
  { id: 'sh_coffin', label: 'Coffin', category: 'Shape', icon: '⚰️' },
  { id: 'sh_square', label: 'Square', category: 'Shape', icon: '⬛' },
  { id: 'sh_round', label: 'Round', category: 'Shape', icon: '⭕' },
  
  { id: 'len_short', label: 'Short', category: 'Length', icon: '📏' },
  { id: 'len_medium', label: 'Medium', category: 'Length', icon: '📏' },
  { id: 'len_long', label: 'Long', category: 'Length', icon: '📏' },
  
  { id: 'col_pink', label: 'Pink', category: 'Color', icon: '🩷' },
  { id: 'col_nude', label: 'Nude', category: 'Color', icon: '🫱' },
  { id: 'col_blue', label: 'Blue', category: 'Color', icon: '💙' },
  { id: 'col_red', label: 'Red', category: 'Color', icon: '❤️' },
  
  { id: 'sty_2coats', label: 'Two coats', category: 'Style', icon: '✌️' },
  { id: 'sty_1coat', label: 'One coat', category: 'Style', icon: '☝️' },
  { id: 'sty_cateye', label: 'Cat-eye', category: 'Style', icon: '👁️' },
  
  { id: 'dec_charms', label: 'Charms', category: 'Deco', icon: '💎' },
  { id: 'dec_french', label: 'French tips', category: 'Deco', icon: '🏳️' },
  { id: 'dec_3d', label: '3D Art', icon: '🎨', category: 'Deco' },
  { id: 'dec_stones', label: 'Stones', icon: '💍', category: 'Deco' }
];

export const STAR_DETECTIVE_ROUNDS: GameRound[] = [
  {
    id: 'round_1',
    audioText: "I want a long Coffin set, please.",
    correctIds: ['sh_coffin', 'len_long'],
    choices: COMMON_CHOICES.filter(c => ['Shape', 'Length'].includes(c.category))
  },
  {
    id: 'round_2',
    audioText: "Can I have two coats of this pink gel and some charms?",
    correctIds: ['col_pink', 'sty_2coats', 'dec_charms'],
    choices: COMMON_CHOICES.filter(c => ['Color', 'Style', 'Deco'].includes(c.category))
  },
  {
    id: 'round_3',
    audioText: "I'd like a short square set in nude color.",
    correctIds: ['len_short', 'sh_square', 'col_nude'],
    choices: COMMON_CHOICES.filter(c => ['Length', 'Shape', 'Color'].includes(c.category))
  },
  {
    id: 'round_4',
    audioText: "Can you do Almond shape with French tips and stones?",
    correctIds: ['sh_almond', 'dec_french', 'dec_stones'],
    choices: COMMON_CHOICES.filter(c => ['Shape', 'Deco'].includes(c.category))
  }
];
