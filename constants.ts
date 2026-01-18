
import { Lesson } from './types';
import { IPA_SOUNDS as IPA_DATA } from './data/ipa';
import { LESSON_1 } from './data/lesson1';
import { LESSON_2 } from './data/lesson2';
import { LESSON_3 } from './data/lesson3';

export const IPA_SOUNDS = IPA_DATA;

export const LESSONS: Lesson[] = [
  LESSON_1,
  LESSON_2,
  LESSON_3
];
