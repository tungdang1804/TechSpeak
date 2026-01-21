
// --- CORE DOMAIN TYPES ---

export enum LessonStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  COMPLETED = 'COMPLETED'
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  ipa: string;
  definition?: string;
  imageUrl?: string;
  exampleSentence?: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  description: string;
  examples: { english: string; vietnamese: string }[];
  isCollocation?: boolean;
}

export interface LessonStep {
  id: string;
  title: string;
  purpose: string;
  lines: {
    id: string;
    speaker: 'Tech' | 'Customer' | 'Student';
    text: string;
    translation: string;
    variations?: { id: string; text: string; translation: string }[];
  }[];
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  thumbnail: string;
  context?: {
    background: string;
    goal: string;
    characters: { name: string; role: string }[];
  };
  steps: LessonStep[];
  vocabularies: Vocabulary[];
  grammar_points: GrammarPoint[];
  roleplay: {
    ai_instructions: string;
    user_instructions: string;
  };
}

// --- GAME & CHALLENGE TYPES ---

// Fix: Added missing GameChoice interface
export interface GameChoice {
  id: string;
  label: string;
  category: string;
  icon: string;
}

// Fix: Added missing GameRound interface
export interface GameRound {
  id: string;
  audioText: string;
  correctIds: string[];
  choices: GameChoice[];
}

// --- USER & PROGRESS DOMAIN ---

export interface AvatarConfig {
  gender: 'male' | 'female';
  baseId: string;
  items: string[];
}

export interface InventoryState {
  ownedItems: string[];
  equipped: {
    desk?: string;
    decor?: string;
    pet?: string;
    wallpaper?: string;
  };
}

// Fix: Added missing SavedPattern interface for grammar library
export interface SavedPattern {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  completedLessons: string[];
  unlockedLessons: string[];
  bestScores: Record<string, number>;
  onboardingComplete: boolean;
  primaryIndustry: 'nails' | 'bartender' | 'flooring' | 'mechanic';
  avatarConfig: AvatarConfig;
  lastDailyReset: string;
  usageCount: number;
  points: number;
  starLevel: number;
  unlockedIndustries: string[];
  userVocabulary: string[];
  userGrammar: SavedPattern[];
  pointHistory: any[];
  isAdmin: boolean;
  inventory?: InventoryState;
}

// Fix: Added UserProgress alias for consistency across components
export type UserProgress = UserProfile;

// --- SPECIALIZED FEATURE TYPES ---

export interface IPASound {
  symbol: string;
  type: 'vowel' | 'diphthong' | 'consonant';
  name?: string;
  description: string;
  examples: { word: string; meaning: string; ipa: string }[];
}

export interface RoleplayTurnResponse {
  ai_response: string;
  user_transcript: string;
  score: number;
  feedback: string;
  satisfaction: number;
  satisfaction_reason?: string;
  is_finished: boolean;
  completion_percentage: number;
  task_checklist: { task: string; is_completed: boolean }[];
  error?: string;
}

export interface RoleplaySummary {
  professional_rating: number;
  total_turns: number;
  overall_evaluation: string;
  strengths: string[];
  improvements: { incorrect: string; correct: string; reason: string }[];
  scores: {
    content: number;
    fluency: number;
    pronunciation: number;
    grammar: number;
  };
}

export interface Industry {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: 'available' | 'coming_soon';
}
