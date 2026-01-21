
import { Lesson } from '../types';
import { getIndustryInfo } from './content/industry';

/**
 * Hardcoded Manifest để đảm bảo tính ổn định cao nhất (Zero-latency)
 */
const LESSONS_MANIFEST = {
  "industries": [
    {
      "id": "nails",
      "name": "Nail & Spa",
      "lessons": [
        "lessons/nails/nails-l1-proactive-booking.json",
        "lessons/nails/nails-l2-welcome-consultation.json",
        "lessons/nails/nails-l3-cuticle-care.json",
        "lessons/nails/nails-l4-extension-shaping.json",
        "lessons/nails/nails-l5-art-finishing.json",
        "lessons/nails/nails-l6-handling-complaints.json",
        "lessons/nails/nails-l7-checkout-reviews.json",
        "lessons/nails/nails-l8-repair-warranty.json"
      ]
    },
    {
      "id": "bartender",
      "name": "Bartender",
      "lessons": ["lessons/bartender/bartender-l1-intro-mixology.json"]
    }
  ]
};

export const fetchLessonsByIndustry = async (industryId: string = 'nails'): Promise<Lesson[]> => {
  try {
    const industry = getIndustryInfo(industryId);
    if (industry.status === 'coming_soon' && industryId !== 'nails') return [];

    const industryData = LESSONS_MANIFEST.industries.find((i: any) => i.id === industryId);
    
    if (!industryData || !industryData.lessons || industryData.lessons.length === 0) {
      return [];
    }

    const lessonPromises = industryData.lessons.map(async (path: string) => {
      // Đảm bảo đường dẫn chuẩn xác cho môi trường browser
      const cleanPath = path.startsWith('./') ? path : `./${path}`;
      try {
        const response = await fetch(cleanPath);
        if (!response.ok) return null;
        return await response.json();
      } catch (err) {
        return null;
      }
    });

    const results = await Promise.all(lessonPromises);
    
    return results
      .filter((l): l is Lesson => l !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Data Service Error:', error);
    return [];
  }
};
