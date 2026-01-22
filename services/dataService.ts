
import { Lesson } from '../types';
import { getIndustryInfo } from './content/industry';
import { LESSON_DATA } from './content/registry';

/**
 * Hardcoded Manifest để quản lý danh sách bài học
 */
const LESSONS_MANIFEST = {
  "industries": [
    {
      "id": "nails",
      "name": "Nail & Spa",
      "lessons": [
        "nails_les1",
        "nails_les2",
        "nails_les3",
        "nails_les4",
        "nails_les5",
        "nails_les6",
        "nails_les7",
        "nails_les8"
      ]
    },
    {
      "id": "bartender",
      "name": "Bartender",
      "lessons": ["bartender_les1"]
    }
  ]
};

export const fetchLessonsByIndustry = async (industryId: string = 'nails'): Promise<Lesson[]> => {
  try {
    const industry = getIndustryInfo(industryId);
    if (industry.status === 'coming_soon' && industryId !== 'nails') return [];

    const industryData = LESSONS_MANIFEST.industries.find((i: any) => i.id === industryId);
    
    if (!industryData || !industryData.lessons) {
      return [];
    }

    // Lấy dữ liệu trực tiếp từ Registry thay vì fetch qua mạng
    const results = industryData.lessons.map(lessonId => {
      return LESSON_DATA[lessonId] || null;
    });
    
    return results
      .filter((l): l is Lesson => l !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Data Service Error:', error);
    return [];
  }
};
