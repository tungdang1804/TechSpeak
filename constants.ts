
import { Lesson } from './types';
import { IPA_SOUNDS as IPA_DATA } from './data/ipa';

export const APP_ASSETS = {
  LOGO: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1768809023/icon-512_ezbknl.png',
  THUMBNAILS: {
    DEFAULT: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop'
  }
};

export const IPA_SOUNDS = IPA_DATA;

// Trống vì sẽ được load động từ App.tsx
export const DEFAULT_LESSONS: Lesson[] = [];
