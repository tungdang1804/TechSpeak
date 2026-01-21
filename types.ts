
export enum LessonStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  COMPLETED = 'COMPLETED'
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  imageUrl?: string;
  definition?: string;
  ipa?: string;
  exampleSentence?: string;
}

export interface ScriptVariation {
  id: string;
  text: string;
  translation: string;
}

export interface ScriptLine {
  id: string;
  speaker: 'Tech' | 'Customer' | 'Student';
  text: string;
  translation: string;
  variations?: ScriptVariation[];
}

export interface LessonStep {
  id: string;
  title: string;
  purpose: string;
  lines: ScriptLine[];
}

export interface GrammarPoint {
  id: string;
  title: string;
  description: string;
  structure?: string;
  examples: { english: string; vietnamese: string }[];
  isCollocation?: boolean;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  thumbnail: string;
  context: {
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

export interface UserProgress {
  completedLessons: string[];
  unlockedLessons: string[];
  bestScores: Record<string, number>;
}

export interface IPASound {
  symbol: string;
  type: 'vowel' | 'diphthong' | 'consonant';
  name?: string;
  description: string;
  examples: { word: string; meaning: string; ipa: string }[];
}

export type GameCategory = 'Shape' | 'Length' | 'Color' | 'Style' | 'Deco' | 'Tools' | 'Payment';

export interface GameChoice {
  id: string;
  label: string;
  category: GameCategory;
  icon?: string;
}

export interface GameRound {
  id: string;
  audioText: string;
  correctIds: string[];
  choices: GameChoice[];
}

export interface RoleplayChecklistItem {
  task: string;
  is_completed: boolean;
}

export interface RoleplayTurnResponse {
  ai_response: string;
  user_transcript: string;
  score: number;
  feedback: string;
  satisfaction: number;
  satisfaction_reason?: string;
  is_finished: boolean;
  task_checklist: RoleplayChecklistItem[];
  completion_percentage: number;
  error?: string;
}

export interface RoleplaySummary {
  overall_evaluation: string;
  strengths: string[];
  improvements: { 
    incorrect: string; 
    correct: string; 
    reason: string; 
  }[];
  professional_rating: number;
  scores: {
    content: number;
    fluency: number;
    pronunciation: number;
    grammar: number;
  };
  total_turns: number;
}
