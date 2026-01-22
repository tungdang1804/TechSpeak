
import { Lesson } from '../../types';

/**
 * Lazy Lesson Loaders
 * Quy ước đặt tên Key và File: [industryId]_les[number]
 * Việc dùng tên file tường minh giúp hệ thống deploy phân giải đường dẫn chính xác.
 */
export const LESSON_LOADERS: Record<string, () => Promise<{ lesson: Lesson }>> = {
  "nails_les1": () => import('./lessons/nails/nails_les1'),
  "nails_les2": () => import('./lessons/nails/nails_les2'),
  "nails_les3": () => import('./lessons/nails/nails_les3'),
  "nails_les4": () => import('./lessons/nails/nails_les4'),
  "nails_les5": () => import('./lessons/nails/nails_les5'),
  "nails_les6": () => import('./lessons/nails/nails_les6'),
  "nails_les7": () => import('./lessons/nails/nails_les7'),
  "nails_les8": () => import('./lessons/nails/nails_les8'),
  "bartender_les1": () => import('./lessons/bartender/bartender_les1'),
};
