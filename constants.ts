
import { Lesson } from './types';
import { IPA_SOUNDS as IPA_DATA } from './data/ipa';
import { LESSON_1 } from './data/lesson1';
import { LESSON_2 } from './data/lesson2';
import { LESSON_3 } from './data/lesson3';
import { LESSON_4 } from './data/lesson4';
import { LESSON_5 } from './data/lesson5';

export const APP_ASSETS = {
  LOGO: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1768809023/icon-512_ezbknl.png',
  THUMBNAILS: {
    LESSON_1: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop',
    LESSON_2: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop',
    LESSON_3: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',
    LESSON_4: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop',
    LESSON_5: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',
  }
};

export const IPA_SOUNDS = IPA_DATA;

export const LESSONS: Lesson[] = [
  LESSON_1,
  LESSON_2,
  LESSON_3,
  LESSON_4,
  LESSON_5
];
