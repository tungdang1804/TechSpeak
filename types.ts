
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
  
  // New Context Information
  contextBackground: string;
  contextGoal: string;
  contextCharacters: { name: string; role: string }[];

  // Situation
  situationTitle: string;
  situationScript: ScriptLine[];

  // Vocabulary
  vocabularies: Vocabulary[];

  // Grammar
  grammarPoints: GrammarPoint[];
  
  roleplayPrompt: string;
  roleplayScenario: string;
  
  homeworkVocab?: Vocabulary[];
  customerInputGroups?: any[];
  techOutputGroups?: any[];
  dialogue?: any[];
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
