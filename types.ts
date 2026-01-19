
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
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  order: number;
  
  // Context Information
  contextBackground: string;
  contextGoal: string;
  contextCharacters: { name: string; role: string }[];

  // Structured Content
  steps: LessonStep[];

  // Vocabulary & Grammar
  vocabularies: Vocabulary[];
  grammarPoints: GrammarPoint[];
  
  roleplayPrompt: string;
  roleplayScenario: string;
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

// Star Detective Types
export type GameCategory = 'Shape' | 'Length' | 'Color' | 'Style' | 'Deco';

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
